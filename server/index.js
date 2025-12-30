require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const apiRoutes = require('./routes');
const nodemailer = require('nodemailer');


const app = express();
const PORT = process.env.PORT || 8010;

// Autoriser le frontend Vite (localhost:5173) via CORS
app.use(cors({
  origin: ['http://localhost:5177'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Configure nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    if (!to || !subject || !text) {
      return res.status(400).json({ error: 'Champs requis manquants : to, subject, text' });
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email envoyé avec succès', messageId: info.messageId });
  } catch (error) {
    console.error('Erreur d\'envoi d\'email :', error);
    res.status(500).json({ error: error.message });
  }
});

connectDB();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Generic error handler to avoid crashing the process
app.use((err, _req, res, _next) => {
  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
