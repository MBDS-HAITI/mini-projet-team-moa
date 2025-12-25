const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const passport = require('../config/oauth');

const router = express.Router();


// Register new user (open to allow first admin creation)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = new User({ username, email, password, role });
    await user.save();
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to create user' });
  }
});

// Login and return JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    // Normalize role to lowercase
    const normalizedRole = (user.role || '').toLowerCase();

    const token = jwt.sign(
      { userId: user._id, role: normalizedRole, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: normalizedRole
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to login' });
  }
});

// OAuth 2.0 Routes (AVANT auth middleware)
router.get('/oauth/login', passport.authenticate('oauth2', {
  scope: ['profile', 'email']
}));

router.get('/oauth/callback', 
  passport.authenticate('oauth2', { session: false, failureRedirect: '/auth/failure' }),
  (req, res) => {
    try {
      if (!req.user || !req.user.user) {
        console.error('OAuth callback: No user data received');
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=no_user_data`);
      }

      const { user, accessToken } = req.user;
      
      if (!user._id || !user.role || !user.username || !user.email) {
        console.error('OAuth callback: Incomplete user data:', user);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=incomplete_user`);
      }

      const appToken = jwt.sign(
        { userId: user._id, role: user.role, username: user.username, email: user.email },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1d' }
      );

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      console.log('OAuth callback successful for user:', user.email);
      res.redirect(`${frontendUrl}/auth/callback?token=${appToken}&oauth=${accessToken}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=callback_failed`);
    }
  }
);

router.post('/oauth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  try {
    const response = await fetch(process.env.OAUTH_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
      })
    });
    
    const data = await response.json();
    res.json({ accessToken: data.access_token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// Diagnostic: retourne le rôle et l'identité issus du token
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('_id username email role oauthProvider password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      tokenPayload: { userId: req.user?.userId, role: req.user?.role },
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        hasPassword: !!user.password,
        isOAuthUser: !!user.oauthProvider
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch profile' });
  }
});

// Permettre à un utilisateur OAuth de définir un mot de passe pour la connexion locale
router.post('/set-password', auth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Définir le nouveau mot de passe (sera hashé automatiquement par le pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({ 
      message: 'Password set successfully. You can now login with email and password.',
      success: true 
    });
  } catch (error) {
    console.error('Set password error:', error);
    res.status(500).json({ error: 'Unable to set password' });
  }
});

// Authenticated + admin-only routes below
router.use(auth, authorize('admin'));

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch users' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) user.password = password; // will be hashed by pre-save hook

    await user.save();
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to update user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete user' });
  }

  
});

module.exports = router;
