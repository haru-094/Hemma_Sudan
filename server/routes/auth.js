const express = require('express');
const router = express.Router();
const db = require('../db');

// Registration strictly restricted to Learner role (BR-1, FR-1.1)
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, university, ageConfirmed } = req.body;

    if (!name || !email || !password || !university) {
      return res.status(400).json({
        errorCode: 'INVALID_INPUT',
        message: 'Name, email, password, and university are required fields.',
      });
    }

    if (!ageConfirmed) {
      return res.status(400).json({
        errorCode: 'AGE_VERIFICATION_REQUIRED',
        message: 'Registration requires confirmation that the student is aged 18 or above (BR-1).',
      });
    }

    const existing = await db.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({
        errorCode: 'EMAIL_ALREADY_EXISTS',
        message: 'An account with this email address is already registered.',
      });
    }

    const newId = `usr-learner-${Date.now()}`;
    const passwordHash = `mock_hash_${password}`;

    const result = await db.query(
      `INSERT INTO users (id, name, email, password_hash, role, language, university, age_confirmed)
       VALUES ($1, $2, $3, $4, 'learner', 'en', $5, $6)
       RETURNING id, name, email, role, language, university, age_confirmed, created_at`,
      [newId, name.trim(), email.trim().toLowerCase(), passwordHash, university.trim(), true]
    );

    res.status(201).json({
      message: 'Learner registered successfully.',
      user: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        errorCode: 'INVALID_INPUT',
        message: 'Email and password are required.',
      });
    }

    const result = await db.query(
      `SELECT id, name, email, role, language, university, course_title 
       FROM users 
       WHERE LOWER(email) = LOWER($1)`,
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        errorCode: 'AUTH_FAILED',
        message: 'Invalid email or password.',
      });
    }

    const user = result.rows[0];

    let approvedTopics = [];
    if (user.role === 'mentor') {
      const approvals = await db.query(
        `SELECT topic_id FROM mentor_approvals WHERE mentor_id = $1 AND revoked_at IS NULL`,
        [user.id]
      );
      approvedTopics = approvals.rows.map((r) => r.topic_id);
    }

    res.status(200).json({
      message: 'Login successful.',
      user: {
        ...user,
        approvedTopics,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, role, university, course_title, created_at 
       FROM users 
       ORDER BY role, name`
    );
    res.status(200).json({ users: result.rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
