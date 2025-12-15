require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 8010;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
