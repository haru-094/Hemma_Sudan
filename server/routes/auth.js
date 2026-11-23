const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db');

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash) return true; // Demo fallback
  if (storedHash.startsWith('mock_hash') || storedHash === 'mock_hash') {
    return true;
  }
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, key] = parts;
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return key === hash;
}

function generateToken(user) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    id: user.id,
    role: user.role,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
  })).toString('base64url');
  const secret = process.env.JWT_SECRET || 'hemma_dev_secret_key_2026';
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

// Registration strictly restricted to Learner role
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
        message: 'Registration requires confirmation that the student is aged 18 or above.',
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
    const passwordHash = hashPassword(password);

    const result = await db.query(
      `INSERT INTO users (id, name, email, password_hash, role, language, university, age_confirmed)
       VALUES ($1, $2, $3, $4, 'learner', 'en', $5, $6)
       RETURNING id, name, email, role, language, university, age_confirmed, created_at`,
      [newId, name.trim(), email.trim().toLowerCase(), passwordHash, university.trim(), true]
    );

    const registeredUser = result.rows[0];
    const token = generateToken(registeredUser);

    res.status(201).json({
      message: 'Learner registered successfully.',
      token,
      user: registeredUser,
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
      `SELECT id, name, email, role, language, university, course_title, password_hash 
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

    // Verify password if hash exists
    if (user.password_hash && !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({
        errorCode: 'AUTH_FAILED',
        message: 'Invalid email or password.',
      });
    }

    let approvedTopics = [];
    if (user.role === 'mentor') {
      const approvals = await db.query(
        `SELECT topic_id FROM mentor_approvals WHERE mentor_id = $1 AND revoked_at IS NULL`,
        [user.id]
      );
      approvedTopics = approvals.rows.map((r) => r.topic_id);
    }

    const token = generateToken(user);

    // Strip password_hash before returning
    const { password_hash, ...safeUser } = user;

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        ...safeUser,
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

// Consent for Data Retention beyond demo duration
router.post('/consent', async (req, res, next) => {
  try {
    const { userId, consent } = req.body;

    if (!userId) {
      return res.status(400).json({
        errorCode: 'MISSING_USER_ID',
        message: 'User ID is required to record retention consent.',
      });
    }

    const consentGiven = Boolean(consent);
    const consentAt = new Date().toISOString();

    await db.query(
      `UPDATE users 
       SET consent_given = $1, consent_at = $2 
       WHERE id = $3`,
      [consentGiven, consentAt, userId]
    );

    res.status(200).json({
      message: consentGiven
        ? 'Consent granted. Your progress records will be retained beyond the demo duration.'
        : 'Consent declined. Your records will be deleted upon conclusion of the demo period.',
      consentGiven,
      consentAt,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
