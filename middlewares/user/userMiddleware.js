import { JWT_SECRET } from "../../config/env.js";
import User from "../../models/user/user.js";
import jwt from 'jsonwebtoken'

const authenticate = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token user" });
    }

    req.user = user;
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Authentication error user authenticate :- ", error.message); // Debugging error
    res.status(401).json({ message: `Authentication error: ${error.message}` });
  }
};

export default authenticate;