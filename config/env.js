import dotenv from 'dotenv';
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const SHOP_JWT_SECRET = process.env.SHOP_JWT_SECRET;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const OTP_EXPIRY_TIME = process.env.OTP_EXPIRY_TIME;
export const OTP_SECRET = process.env.OTP_SECRET;
export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
export const PORT = process.env.PORT || 5000;
export const GOOGLE_CLIENT = process.env.GOOGLE_CLIENT;
export const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
export const CLIENT_URL = process.env.CLIENT_URL;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
