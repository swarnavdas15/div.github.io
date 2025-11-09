import express from 'express';
import passport from 'passport';
import { registerUser, loginUser, getProfile, oauthSuccess, oauthFailure } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.get('/profile', protect, getProfile);

// OAuth routes with error handling
router.get('/google', (req, res, next) => {
  if (!passport._strategies.google) {
    return res.status(503).json({ message: 'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.' });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback',
  (req, res, next) => {
    if (!passport._strategies.google) {
      return res.redirect('/api/auth/failure');
    }
    next();
  },
  passport.authenticate('google', { failureRedirect: '/api/auth/failure' }),
  oauthSuccess
);

router.get('/github', (req, res, next) => {
  if (!passport._strategies.github) {
    return res.status(503).json({ message: 'GitHub OAuth is not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables.' });
  }
  passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

router.get('/github/callback',
  (req, res, next) => {
    if (!passport._strategies.github) {
      return res.redirect('/api/auth/failure');
    }
    next();
  },
  passport.authenticate('github', { failureRedirect: '/api/auth/failure' }),
  oauthSuccess
);

router.get('/linkedin', (req, res, next) => {
  if (!passport._strategies.linkedin) {
    return res.status(503).json({ message: 'LinkedIn OAuth is not configured. Please set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET environment variables.' });
  }
  passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] })(req, res, next);
});

router.get('/linkedin/callback',
  (req, res, next) => {
    if (!passport._strategies.linkedin) {
      return res.redirect('/api/auth/failure');
    }
    next();
  },
  passport.authenticate('linkedin', { failureRedirect: '/api/auth/failure' }),
  oauthSuccess
);

// OAuth failure route
router.get('/failure', oauthFailure);

export default router;
