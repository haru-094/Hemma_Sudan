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

// FR-6.3: GitHub URL Reachability Verification
async function checkGithubReachability(githubUrl) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(githubUrl.trim(), {
      method: 'HEAD',
      headers: {
        'User-Agent': 'HemmaSudan-Validator/1.0',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.status === 404) {
      return {
        reachable: false,
        errorCode: 'REPO_NOT_FOUND',
        message: 'Repository not found or is private. Please ensure the repository is public and accessible.',
      };
    }

    if (response.status === 403 || response.status === 429) {
      // Rate-limited by GitHub API/frontend — treat valid structure as accepted
      return { reachable: true, message: 'Format verified (GitHub rate-limited).' };
    }

    if (!response.ok && response.status >= 400) {
      return {
        reachable: false,
        errorCode: 'REPO_UNREACHABLE',
        message: `Repository returned HTTP error ${response.status}. Please check repository visibility.`,
      };
    }

    return { reachable: true, message: 'Repository is public and reachable.' };
  } catch (err) {
    // If probe fails due to offline server or network timeout, log and pass
    console.warn('GitHub reachability probe skipped/timed out:', err.message);
    return { reachable: true, warning: 'Probe timed out; format verified.' };
  }
}

// POST /api/submissions/validate-github (FR-6.3)
router.post('/submissions/validate-github', async (req, res, next) => {
  try {
    const { githubLink } = req.body;

    if (!githubLink || !isValidGithubUrl(githubLink)) {
      return res.status(400).json({
        reachable: false,
        errorCode: 'INVALID_GITHUB_URL',
        message: 'Please provide a valid GitHub repository URL (e.g., https://github.com/username/project).',
      });
    }

    const check = await checkGithubReachability(githubLink);
    if (!check.reachable) {
      return res.status(400).json(check);
    }

    res.status(200).json(check);
  } catch (err) {
    next(err);
  }
});

router.post('/submissions', async (req, res, next) => {
  try {
    const { topicId, learnerId, githubLink, explanation, skipReachabilityCheck = false } = req.body;

    if (!topicId || !learnerId || !githubLink || !explanation) {
      return res.status(400).json({
        errorCode: 'MISSING_FIELDS',
        message: 'Topic, learner ID, GitHub link, and explanation are required.',
      });
    }

    if (!isValidGithubUrl(githubLink)) {
      return res.status(400).json({
        errorCode: 'INVALID_GITHUB_URL',
        message: 'The submission URL must be a valid, reachable GitHub repository link.',
      });
    }

    // FR-6.3: Reachability check at submission time
    if (!skipReachabilityCheck) {
      const reachability = await checkGithubReachability(githubLink);
      if (!reachability.reachable) {
        return res.status(400).json(reachability);
      }
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

// GET /api/submissions - Retrieves submissions with attached feedback history
router.get('/submissions', async (req, res, next) => {
  try {
    const { learnerId } = req.query;

    let query = `
      SELECT s.*, u.name as learner_name, u.university as learner_university,
             t.title_en as topic_title_en, t.title_ar as topic_title_ar,
             ra.mentor_id as assigned_mentor_id, mu.name as assigned_mentor_name
      FROM submissions s
      JOIN users u ON s.learner_id = u.id
      JOIN topics t ON s.topic_id = t.id
      LEFT JOIN LATERAL (
        SELECT mentor_id FROM review_assignments 
        WHERE submission_id = s.id 
        ORDER BY assigned_at DESC LIMIT 1
      ) ra ON true
      LEFT JOIN users mu ON ra.mentor_id = mu.id
    `;
    const params = [];

    if (learnerId) {
      params.push(learnerId);
      query += ` WHERE s.learner_id = $1`;
    }

    query += ` ORDER BY s.submitted_at DESC`;

    const subResult = await db.query(query, params);

    // Fetch feedbacks for these submissions
    const feedbackResult = await db.query(
      `SELECT f.*, u.name as author_name, u.role as author_role
       FROM feedbacks f
       JOIN users u ON f.author_id = u.id
       ORDER BY f.created_at ASC`
    );

    const submissionsWithFeedbacks = subResult.rows.map((sub) => ({
      ...sub,
      feedbacks: feedbackResult.rows.filter((f) => f.submission_id === sub.id),
    }));

    res.status(200).json({ submissions: submissionsWithFeedbacks });
  } catch (err) {
    next(err);
  }
});

// GET /api/submissions/history/:topicId/:learnerId - Multi-attempt history timeline
router.get('/submissions/history/:topicId/:learnerId', async (req, res, next) => {
  try {
    const { topicId, learnerId } = req.params;

    const subResult = await db.query(
      `SELECT s.*, t.title_en as topic_title_en, t.title_ar as topic_title_ar
       FROM submissions s
       JOIN topics t ON s.topic_id = t.id
       WHERE s.topic_id = $1 AND s.learner_id = $2
       ORDER BY s.attempt_no ASC`,
      [topicId, learnerId]
    );

    const subIds = subResult.rows.map((s) => s.id);
    let feedbackRows = [];

    if (subIds.length > 0) {
      const fbResult = await db.query(
        `SELECT f.*, u.name as author_name, u.role as author_role
         FROM feedbacks f
         JOIN users u ON f.author_id = u.id
         WHERE f.submission_id = ANY($1::text[])
         ORDER BY f.created_at ASC`,
        [subIds]
      );
      feedbackRows = fbResult.rows;
    }

    const history = subResult.rows.map((sub) => ({
      ...sub,
      feedbacks: feedbackRows.filter((f) => f.submission_id === sub.id),
    }));

    res.status(200).json({ history });
  } catch (err) {
    next(err);
  }
});

// Mentor / Teacher reviews a submission
router.post('/submissions/:id/feedback', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { authorId, comment, action } = req.body;

    const subRes = await db.query('SELECT * FROM submissions WHERE id = $1', [id]);
    if (subRes.rows.length === 0) {
      return res.status(404).json({ errorCode: 'SUBMISSION_NOT_FOUND', message: 'Submission not found.' });
    }
    const submission = subRes.rows[0];

    // Prevent reviewing own submission
    if (submission.learner_id === authorId) {
      return res.status(403).json({
        errorCode: 'SELF_REVIEW_FORBIDDEN',
        message: 'Users cannot review their own submissions.',
      });
    }

    let newStatus = 'under_review';
    let feedbackKind = 'comment';

    if (action === 'approve') {
      newStatus = 'feedback_given';
      feedbackKind = 'comment';
    } else if (action === 'request_revision' || action === 'revision') {
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
      status: newStatus,
    });
  } catch (err) {
    next(err);
  }
});

// Resolve escalation (Teacher exclusive)
router.post('/submissions/:id/resolve-escalation', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { teacherId, resolution, comment } = req.body;

    const teacherCheck = await db.query('SELECT role FROM users WHERE id = $1', [teacherId]);
    if (teacherCheck.rows.length === 0 || teacherCheck.rows[0].role !== 'teacher') {
      return res.status(403).json({
        errorCode: 'TEACHER_ONLY',
        message: 'Only the course teacher can resolve escalated submissions.',
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

// Learner requests direct teacher review (FR-10.2)
router.post('/submissions/:id/request-teacher', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { learnerId, reason } = req.body;

    const subRes = await db.query('SELECT * FROM submissions WHERE id = $1', [id]);
    if (subRes.rows.length === 0) {
      return res.status(404).json({ errorCode: 'SUBMISSION_NOT_FOUND', message: 'Submission not found.' });
    }
    const submission = subRes.rows[0];

    if (learnerId && submission.learner_id !== learnerId) {
      return res.status(403).json({
        errorCode: 'UNAUTHORIZED_LEARNER',
        message: 'Only the submission author can request a teacher review.',
      });
    }

    const comment = reason || 'Learner requested direct review from course lead.';
    await db.query(
      `INSERT INTO feedbacks (id, submission_id, author_id, comment, kind)
       VALUES ($1, $2, $3, $4, 'escalation_resolution')`,
      [`fb-${Date.now()}`, id, learnerId || submission.learner_id, comment]
    );

    const updated = await db.query(
      `UPDATE submissions SET status = 'escalated' WHERE id = $1 RETURNING *`,
      [id]
    );

    res.status(200).json({
      message: 'Teacher review requested successfully.',
      submission: updated.rows[0],
      status: 'escalated',
    });
  } catch (err) {
    next(err);
  }
});

// Teacher assigns mentor to a submission (FR-9.1)
router.post('/submissions/:id/assign', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { teacherId, mentorId } = req.body;

    const teacherCheck = await db.query('SELECT role FROM users WHERE id = $1', [teacherId]);
    if (teacherCheck.rows.length === 0 || teacherCheck.rows[0].role !== 'teacher') {
      return res.status(403).json({
        errorCode: 'TEACHER_ONLY',
        message: 'Only the course teacher can assign reviewers.',
      });
    }

    const assignId = `rev-assign-${Date.now()}`;
    await db.query(
      `INSERT INTO review_assignments (id, submission_id, mentor_id, assigned_by, state)
       VALUES ($1, $2, $3, $4, 'assigned')`,
      [assignId, id, mentorId, teacherId]
    );

    const updated = await db.query(
      `UPDATE submissions SET status = 'under_review' WHERE id = $1 RETURNING *`,
      [id]
    );

    res.status(200).json({
      message: 'Reviewer assigned successfully.',
      submission: updated.rows[0],
      assignment: { id: assignId, submissionId: id, mentorId },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
