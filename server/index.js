const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const curriculumRoutes = require('./routes/curriculum');
const submissionRoutes = require('./routes/submissions');
const syncRoutes = require('./routes/sync');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Hemma Sudan Backend API',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api', curriculumRoutes);
app.use('/api', submissionRoutes);
app.use('/api/sync', syncRoutes);

app.use((req, res) => {
  res.status(404).json({
    errorCode: 'NOT_FOUND',
    message: `Resource not found at ${req.originalUrl}`,
  });
});

// Centralized JSON error formatting (SRS §3.3)
app.use((err, req, res, next) => {
  console.error('Server error encountered:', err);
  const status = err.status || 500;
  res.status(status).json({
    errorCode: err.errorCode || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred on the server.',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Hemma Sudan backend API running on port ${PORT}`);
  });
}

module.exports = app;
