import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import User from '../models/User.js';

// Configure Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL || 'http://localhost:5000'}/api/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await User.findOne({
        $or: [
          { provider: 'google', providerId: profile.id },
          { email: email }
        ]
      });

      if (user) {
        // Update provider info if user exists but not linked to Google
        if (!user.provider) {
          user.provider = 'google';
          user.providerId = profile.id;
          await user.save();
        }
      } else {
        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: email,
          provider: 'google',
          providerId: profile.id,
          role: 'member',
          avatar: profile.photos[0] ? profile.photos[0].value : ''
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

// Configure GitHub Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL || 'http://localhost:5000'}/api/auth/github/callback`,
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await User.findOne({
        $or: [
          { provider: 'github', providerId: profile.id },
          { email: email }
        ]
      });

      if (user) {
        // Update provider info if user exists but not linked to GitHub
        if (!user.provider) {
          user.provider = 'github';
          user.providerId = profile.id;
          await user.save();
        }
      } else {
        // Create new user
        user = await User.create({
          name: profile.displayName || profile.username,
          email: email,
          provider: 'github',
          providerId: profile.id,
          role: 'member',
          avatar: profile.photos[0] ? profile.photos[0].value : ''
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

// Configure LinkedIn Strategy
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL || 'http://localhost:5000'}/api/auth/linkedin/callback`,
    scope: ['r_emailaddress', 'r_liteprofile']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await User.findOne({
        $or: [
          { provider: 'linkedin', providerId: profile.id },
          { email: email }
        ]
      });

      if (user) {
        // Update provider info if user exists but not linked to LinkedIn
        if (!user.provider) {
          user.provider = 'linkedin';
          user.providerId = profile.id;
          await user.save();
        }
      } else {
        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: email,
          provider: 'linkedin',
          providerId: profile.id,
          role: 'member',
          avatar: profile.photos[0] ? profile.photos[0].value : ''
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;