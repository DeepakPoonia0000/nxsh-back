import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET);
};

export const generateExpirableToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (payload) => {
    return jwt.verify(payload, JWT_SECRET);
};