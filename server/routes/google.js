const express = require('express');
const { loginGoogle } = require('../controllers/authController');

const router = express.Router();

// Google token-based login
router.post('/auth/google', loginGoogle);

module.exports = router;