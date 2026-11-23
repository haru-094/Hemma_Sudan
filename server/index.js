const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const curriculumRoutes = require('./routes/curriculum');
const submissionRoutes = require('./routes/submissions');
const syncRoutes = require('./routes/sync');
const teacherRoutes = require('./routes/teacher');

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

app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Hemma Sudan API Server</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 650px; margin: 50px auto; padding: 20px; line-height: 1.6; color: #1e293b; background: #f8fafc; }
        .card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        h1 { color: #0f766e; margin-top: 0; font-size: 24px; }
        .badge { display: inline-block; background: #ccfbf1; color: #115e59; font-weight: bold; font-size: 12px; padding: 4px 10px; border-radius: 20px; margin-bottom: 16px; }
        ul { padding-left: 20px; }
        li { margin-bottom: 8px; }
        a { color: #0f766e; text-decoration: none; font-weight: 600; }
        a:hover { text-decoration: underline; }
        .frontend-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="card">
        <span class="badge">● Backend API Server Running</span>
        <h1>Hemma Sudan REST API</h1>
        <p>This port (<code>:5001</code>) serves the backend JSON API.</p>
        
        <div class="frontend-box">
          <strong>Looking for the Visual User Interface?</strong>
          <p style="margin: 6px 0 0 0;">Start the Vite frontend in another terminal: <code>npm run dev --prefix client</code> and open <a href="http://localhost:5173" target="_blank">http://localhost:5173</a>.</p>
        </div>

        <h3 style="margin-top: 24px;">Explore API Endpoints:</h3>
        <ul>
          <li><a href="/health">/health</a> — Health check status</li>
          <li><a href="/api/topics">/api/topics</a> — Curriculum modules and lessons</li>
          <li><a href="/api/auth/users">/api/auth/users</a> — System users</li>
          <li><a href="/api/submissions">/api/submissions</a> — Assignment submissions queue</li>
          <li><a href="/api/teacher/mentors">/api/teacher/mentors</a> — Mentors list</li>
          <li><a href="/api/teacher/audit-logs">/api/teacher/audit-logs</a> — System audit trail</li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

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
app.use('/api/teacher', teacherRoutes);

app.use((req, res) => {
  res.status(404).json({
    errorCode: 'NOT_FOUND',
    message: `Resource not found at ${req.originalUrl}`,
  });
});

// Centralized JSON error formatting
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
  app.listen(PORT, async () => {
    console.log(`Hemma Sudan backend API running on port ${PORT}`);
    if (process.env.DATABASE_URL) {
      try {
        const { seedDatabase } = require('./seed');
        await seedDatabase();
      } catch (err) {
        console.warn('Auto-seed check note:', err.message);
      }
    }
  });
}

module.exports = app;
