import { SHOP_JWT_SECRET } from "../../config/env.js";
import Seller from "../../models/seller/seller.js";
import jwt from 'jsonwebtoken'

const authenticate = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(' ')[1];
        // const token = req.headers.authorization?.split(" ")[1]; // This will split the "Bearer <token>" and extract the token

        if (!token) {
            token = req.cookies.token;
        }

        // console.log("Token: ==>", token); // Debug token
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, SHOP_JWT_SECRET);

        const shop = await Seller.findById(decoded.shopId);
        // console.log("userDetails from token = ", shop);
        if (!shop) {
            return res.status(401).json({ message: "Invalid token user" });
        }

        req.shop = shop;
        req.shopId = decoded.shopId;
        next();
    } catch (error) {
        console.error("Authentication error user:", error); // Debugging error
        res.status(401).json({ message: `Authentication error: ${error.message}` });
    }
};

export default authenticate;