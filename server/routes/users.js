const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

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

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to login' });
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
