import express from 'express';
import passport from 'passport';
import { signup, createPassword, login, forgotPassword, resetPassword, getMe, logout } from '../controllers/authController.js';
import { generateToken } from '../utils/jwt.js';
import { CLIENT_URL } from '../config/env.js';
import authenticate from '../middlewares/user/userMiddleware.js';

const router = express.Router();

function handleGoogleCallback(req, res, cookieName) {
  if (!req.user) return res.redirect(`${CLIENT_URL}/auth/google/failure`);

  const token = generateToken({ id: req.user._id });

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    maxAge: 70 * 24 * 60 * 60 * 1000,
  });

  res.redirect(CLIENT_URL);
}


router.post('/signup', signup);
router.post('/create-password', createPassword);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


router.post('/getMe', authenticate, getMe)
router.post('/logout', logout)


// router.get('/google/buyer', passport.authenticate('google-buyer', {
//   scope: ['profile', 'email'],
//   accessType: 'offline',
//   prompt: 'consent',
// }));

// router.get('/google/callback/buyer',
//   passport.authenticate('google-buyer', { failureRedirect: `${CLIENT_URL}/auth/google/failure` }),

//   (req, res) => {
//     console.log("📥 Callback route hit");
//     if (!req.user) return res.redirect(`${CLIENT_URL}/auth/google/failure`);
//     const token = generateToken({ id: req.user._id });
//     // Set the token as a secure, HTTP-only cookie
//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: 'Lax',
//       maxAge: 70 * 24 * 60 * 60 * 1000, // 70 day
//     });

//     res.redirect(`${CLIENT_URL}`);
//   }
// );

// router.get('/google/seller', passport.authenticate('google-seller', {
//   scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.send'],
//   accessType: 'offline',
//   prompt: 'consent',
// }));

// router.get('/google/callback/seller',
//   passport.authenticate('google-seller', { failureRedirect: `${CLIENT_URL}/auth/google/failure` }),

//   (req, res) => {
//     console.log("📥 Callback route hit");
//     if (!req.user) return res.redirect(`${CLIENT_URL}/auth/google/failure`);
//     const token = generateToken({ id: req.user._id });
//     // Set the token as a secure, HTTP-only cookie
//     res.cookie('shopToken', token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: 'Lax',
//       maxAge: 70 * 24 * 60 * 60 * 1000, // 70 day
//     });

//     res.redirect(`${CLIENT_URL}`);
//   }
// );

// Signup routes
router.get('/google/buyer/signup', passport.authenticate('google-buyer-signup', {
  scope: ['profile', 'email'],
  accessType: 'offline',
  prompt: 'consent',
}));

router.get('/google/callback/buyer/signup',
  passport.authenticate('google-buyer-signup', {
    failureRedirect: `${CLIENT_URL}/auth/google/failure`,
    session: false,
  }),
  (req, res) => handleGoogleCallback(req, res, 'token') // buyer token name
);

// Login routes
router.get('/google/buyer/login', passport.authenticate('google-buyer-login', {
  scope: ['profile', 'email'],
}));

router.get('/google/callback/buyer/login',
  passport.authenticate('google-buyer-login', {
    failureRedirect: `${CLIENT_URL}/auth/google/failure`,
    session: false,
  }),
  (req, res) => handleGoogleCallback(req, res, 'token')
);

// Repeat same for seller using `shopToken` instead of `token`

router.get('/google/seller/signup', passport.authenticate('google-seller-signup', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.send'],
  accessType: 'offline',
  prompt: 'consent',
}));

router.get('/google/callback/seller/signup',
  passport.authenticate('google-seller-signup', {
    failureRedirect: `${CLIENT_URL}/auth/google/failure`,
    session: false,
  }),
  (req, res) => handleGoogleCallback(req, res, 'shopToken')
);

router.get('/google/seller/login', passport.authenticate('google-seller-login', {
  scope: ['profile', 'email'],
}));

router.get('/google/callback/seller/login',
  passport.authenticate('google-seller-login', {
    failureRedirect: `${CLIENT_URL}/auth/google/failure`,
    session: false,
  }),
  (req, res) => handleGoogleCallback(req, res, 'shopToken')
);


export default router;