import express from 'express';
import passport from 'passport';
import { signup, createPassword, login, forgotPassword, resetPassword, getMe, logout } from '../../controllers/seller/authController.js';
import { generateToken } from '../../utils/jwt.js';
import { CLIENT_URL } from '../../config/env.js';
import authenticate from '../../middlewares/seller/shopMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/create-password', createPassword);
router.post('/login', login);
router.post('/logout', logout)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/getMe', authenticate, getMe)

router.get('/google/seller', passport.authenticate('google-seller', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.send'],
  accessType: 'offline',
  prompt: 'consent',
}));

router.get('/google/callback/seller',
  passport.authenticate('google-seller', { failureRedirect: `${CLIENT_URL}/auth/google/failure` }),

  (req, res) => {
    console.log("📥 Callback route hit");
    if (!req.user) return res.redirect(`${CLIENT_URL}/auth/google/failure`);
    const token = generateToken({ id: req.user._id });
    res.redirect(`${CLIENT_URL}/seller/signup?token=${token}`);
  }
);

export default router;
