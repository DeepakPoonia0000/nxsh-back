import { JWT_SECRET } from "../../config/env.js";
import jwt from 'jsonwebtoken'
import Shop from "../../models/seller/shopSchema.js";
import User from "../../models/user.js";

const authenticate = async (req, res, next) => {
    try {
        let token = req.cookies.sellerToken;

        if (!token) {
            token = req.headers.authorization?.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.id)

        if (!user || user.role !== "seller") {
            return res.status(401).json({ message: "Invalid token or user is not a seller" });
        }

        req.user = user;
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error("Authentication error shop:", error); // Debugging error
        res.status(401).json({ message: `Authentication error: ${error.message}` });
    }
};

export default authenticate;