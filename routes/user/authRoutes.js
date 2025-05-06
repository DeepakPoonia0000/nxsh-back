import express from 'express';
import passport from 'passport';
import { signup, createPassword, login, forgotPassword, resetPassword, getMe, logout } from '../../controllers/user/authController.js';
import { generateToken } from '../../utils/jwt.js';
import { CLIENT_URL } from '../../config/env.js';
import authenticate from '../../middlewares/user/userMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/create-password', createPassword);
router.post('/login', login);
router.post('/logout', logout)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/getMe', authenticate, getMe)


router.get('/google/buyer', passport.authenticate('google-buyer', {
  scope: ['profile', 'email'],
  accessType: 'offline',
  prompt: 'consent',
}));

router.get('/google/callback/buyer',
  passport.authenticate('google-buyer', { failureRedirect: `${CLIENT_URL}/auth/google/failure` }),

  (req, res) => {
    console.log("📥 Callback route hit");
    if (!req.user) return res.redirect(`${CLIENT_URL}/auth/google/failure`);
    const token = generateToken({ id: req.user._id });
    // Set the token as a secure, HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 70 * 24 * 60 * 60 * 1000, // 70 day
    });

    res.redirect(`${CLIENT_URL}/signup`);
  }
);

export default router;