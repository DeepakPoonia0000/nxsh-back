import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/mailer.js';
import { generateToken } from '../../utils/jwt.js';
import { CLIENT_URL, JWT_SECRET } from '../../config/env.js';
import Seller from '../../models/seller/seller.js';


export const signup = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await Seller.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '55m' });
        const link = `${CLIENT_URL}/create-password/${token}`;
        await sendEmail(email, 'Create Your Password', `<a href="${link}">Set Password</a>`);

        res.status(200).json({ message: 'Check your email to set password' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createPassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const hashed = await bcrypt.hash(password, 10);

        const user = await Seller.findOneAndUpdate(
            { email: decoded.email },
            { password: hashed, isVerified: true },
            { new: true, upsert: true }
        );

        const authToken = generateToken({ id: user._id });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // Set secure in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({ token: authToken });
    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Seller.findOne({ email });
        if (!user || !user.isVerified) return res.status(401).json({ message: 'Unauthorized' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const token = generateToken({ id: user._id });
        // Set token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // Set secure in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const logout = async (req, res) => {
    try {
        // Clear all cookies
        const cookies = req.cookies; // Get all cookies

        if (cookies) {
            for (const cookieName in cookies) {
                res.clearCookie(cookieName, { path: '/' }); // Match how they were set
            }
        }

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await Seller.findOne({ email });
        if (!user) return res.status(200).json({ message: 'If account exists, reset link sent' });

        const token = jwt.sign({ id: user._id, time: Date.now() }, JWT_SECRET, { expiresIn: '15m' });
        const link = `${CLIENT_URL}/reset-password/${token}`;
        await sendEmail(email, 'Reset Password', `<a href="${link}">Reset</a>`);

        res.status(200).json({ message: 'Password reset link sent' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const hashed = await bcrypt.hash(password, 10);
        await Seller.findByIdAndUpdate(decoded.id, { password: hashed });

        res.status(200).json({ message: 'Password updated' });
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

export const getMe = async (req, res) => {
    try {
        if (req.user) {
            const { name, email, picture, role } = req.user;

            res.status(200).json({
                user: {
                    name,
                    email,
                    picture,
                    role
                }
            });
        } else {
            res.status(401).json({ message: "Not Authorized." });
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ error });
    }
};
