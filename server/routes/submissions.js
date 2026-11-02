const express = require('express');
const router = express.Router();
const db = require('../db');

function isValidGithubUrl(url) {
  try {
    const parsed = new URL(url.trim());
    return (
      (parsed.hostname === 'github.com' || parsed.hostname === 'www.github.com') &&
      parsed.pathname.split('/').filter(Boolean).length >= 2
    );
  } catch {
    return false;
  }
}

router.post('/submissions', async (req, res, next) => {
  try {
    const { topicId, learnerId, githubLink, explanation } = req.body;

    if (!topicId || !learnerId || !githubLink || !explanation) {
      return res.status(400).json({
        errorCode: 'MISSING_FIELDS',
        message: 'Topic, learner ID, GitHub link, and explanation are required.',
      });
    }

    if (!isValidGithubUrl(githubLink)) {
      return res.status(400).json({
        errorCode: 'INVALID_GITHUB_URL',
        message: 'The submission URL must be a valid, reachable GitHub repository link (FR-6.3).',
      });
    }

    const prevAttempts = await db.query(
      `SELECT MAX(attempt_no) as max_attempt 
       FROM submissions 
       WHERE topic_id = $1 AND learner_id = $2`,
      [topicId, learnerId]
    );

    const nextAttempt = (prevAttempts.rows[0].max_attempt || 0) + 1;
    const newId = `sub-${Date.now()}`;

    const result = await db.query(
      `INSERT INTO submissions (id, topic_id, learner_id, github_link, explanation, attempt_no, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'submitted')
       RETURNING *`,
      [newId, topicId, learnerId, githubLink.trim(), explanation.trim(), nextAttempt]
    );

    res.status(201).json({
      message: 'Submission created successfully.',
      submission: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

router.get('/submissions', async (req, res, next) => {
  try {
    const { learnerId } = req.query;

    let query = `
      SELECT s.*, u.name as learner_name, u.university as learner_university,
             t.title_en as topic_title_en, t.title_ar as topic_title_ar
      FROM submissions s
      JOIN users u ON s.learner_id = u.id
      JOIN topics t ON s.topic_id = t.id
    `;
    const params = [];

    if (learnerId) {
      params.push(learnerId);
      query += ` WHERE s.learner_id = $1`;
    }

    query += ` ORDER BY s.submitted_at DESC`;

    const result = await db.query(query, params);
    res.status(200).json({ submissions: result.rows });
  } catch (err) {
    next(err);
  }
});

// Mentor / Teacher reviews a submission (BR-3, BR-4)
router.post('/submissions/:id/feedback', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { authorId, comment, action } = req.body;

    const subRes = await db.query('SELECT * FROM submissions WHERE id = $1', [id]);
    if (subRes.rows.length === 0) {
      return res.status(404).json({ errorCode: 'SUBMISSION_NOT_FOUND', message: 'Submission not found.' });
    }
    const submission = subRes.rows[0];

    // Prevent reviewing own submission (BR-4)
    if (submission.learner_id === authorId) {
      return res.status(403).json({
        errorCode: 'SELF_REVIEW_FORBIDDEN',
        message: 'Users cannot review their own submissions (BR-4).',
      });
    }

    let newStatus = 'under_review';
    let feedbackKind = 'comment';

    if (action === 'approve') {
      newStatus = 'feedback_given';
      feedbackKind = 'comment';
    } else if (action === 'request_revision') {
      newStatus = 'revision_requested';
      feedbackKind = 'revision_request';
    } else if (action === 'escalate') {
      newStatus = 'escalated';
      feedbackKind = 'escalation_resolution';
    }

    const feedbackId = `fb-${Date.now()}`;
    await db.query(
      `INSERT INTO feedbacks (id, submission_id, author_id, comment, kind)
       VALUES ($1, $2, $3, $4, $5)`,
      [feedbackId, id, authorId, comment.trim(), feedbackKind]
    );

    const updated = await db.query(
      `UPDATE submissions SET status = $1 WHERE id = $2 RETURNING *`,
      [newStatus, id]
    );

    res.status(200).json({
      message: 'Feedback submitted and status updated.',
      submission: updated.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

// Resolve escalation (BR-5: Teacher exclusive)
router.post('/submissions/:id/resolve-escalation', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { teacherId, resolution, comment } = req.body;

    const teacherCheck = await db.query('SELECT role FROM users WHERE id = $1', [teacherId]);
    if (teacherCheck.rows.length === 0 || teacherCheck.rows[0].role !== 'teacher') {
      return res.status(403).json({
        errorCode: 'TEACHER_ONLY',
        message: 'Only the course teacher can resolve escalated submissions (BR-5).',
      });
    }

    const nextStatus = resolution === 'complete' ? 'complete' : 'revision_requested';

    await db.query(
      `INSERT INTO feedbacks (id, submission_id, author_id, comment, kind)
       VALUES ($1, $2, $3, $4, 'escalation_resolution')`,
      [`fb-${Date.now()}`, id, teacherId, comment || 'Escalation resolved by Teacher.', 'escalation_resolution']
    );

    const updated = await db.query(
      `UPDATE submissions SET status = $1 WHERE id = $2 RETURNING *`,
      [nextStatus, id]
    );

    res.status(200).json({
      message: 'Escalation resolved successfully.',
      submission: updated.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
