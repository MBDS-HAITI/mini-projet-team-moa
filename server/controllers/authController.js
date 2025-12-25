import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// LOGIN GOOGLE
export const loginGoogle = async (req, res) => {
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

    // Try to find existing user
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user with a random password (hashed)
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashed = await bcrypt.hash(randomPassword, 10);

      // Determine role: if email is listed in ADMIN_EMAILS env var, make admin
      let role = 'student';
      const adminList = process.env.ADMIN_EMAILS || '';
      const admins = adminList.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
      if (admins.includes(email.toLowerCase())) role = 'admin';

      user = new User({
        name: payload.name || 'Google User',
        email,
        password: hashed,
        provider: 'google',
        profileImage: payload.picture,
        role,
      });

      await user.save();
    } else {
      // ensure provider is set to google
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

    res.status(200).json({ success: true, token: appToken, user: { id: user._id, name: user.name, role: user.role, email: user.email, profileImage: user.profileImage } });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};

export const googleCallback = (req, res) => {
  const token = jwt.sign(
    { id: req.user._id, role: req.user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  // ✅ SAME RESPONSE STRUCTURE
  res.redirect(
    `http://localhost:5173/oauth-success?token=${token}&role=${req.user.role}`
  );
};


export const githubCallback = (req, res) => {
  const token = jwt.sign(
    { id: req.user._id, role: req.user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  // ✅ SAME LOGIC
  res.redirect(
    `http://localhost:5173/oauth-success?token=${token}&role=${req.user.role}`
  );
};


