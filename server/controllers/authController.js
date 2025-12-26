const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// =========================
// LOGIN AVEC GOOGLE
// =========================
const loginGoogle = async (req, res) => {
  console.log("=== GOOGLE LOGIN HIT ===");
  console.log("BODY:", req.body);
  console.log("TOKEN:", req.body?.token);
  console.log("CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Missing token' });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashed = await bcrypt.hash(randomPassword, 10);

      let role = 'student';
      const adminList = process.env.ADMIN_EMAILS || '';
      const admins = adminList
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      if (admins.includes(email.toLowerCase())) role = 'admin';

      user = new User({
        name: payload.name || 'Google User',
        email,
        password: hashed,
        provider: 'google',
        profileImage: payload.picture || null,
        role,
      });

      await user.save();
    } else {
      if (user.provider !== 'google') {
        user.provider = 'google';
        await user.save();
      }
    }

    const appToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token: appToken,
      user: {
        id: user._id,
        username: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || null
      }
    });
  } catch (err) {
    console.error('GOOGLE LOGIN ERROR:', err);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};

// =========================
// CALLBACKS (OPTIONNELS)
// =========================
const googleCallback = (req, res) => {
  const token = jwt.sign(
    { id: req.user._id, role: req.user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.redirect(
    `http://localhost:5173/oauth-success?token=${token}&role=${req.user.role}`
  );
};

const githubCallback = (req, res) => {
  const token = jwt.sign(
    { id: req.user._id, role: req.user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.redirect(
    `http://localhost:5173/oauth-success?token=${token}&role=${req.user.role}`
  );
};

// =========================
// EXPORT COMMONJS
// =========================
module.exports = {
  loginGoogle,
  googleCallback,
  githubCallback
};