import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET);
};
