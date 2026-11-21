const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/teacher/mentors - Get all mentors with their approved topics
router.get('/mentors', async (req, res, next) => {
  try {
    const mentorsRes = await db.query(
      `SELECT id, name, email, role, university, created_at 
       FROM users 
       WHERE role IN ('mentor', 'learner') 
       ORDER BY role DESC, name ASC`
    );

    const approvalsRes = await db.query(
      `SELECT id, mentor_id, topic_id, granted_at, revoked_at 
       FROM mentor_approvals 
       WHERE revoked_at IS NULL`
    );

    const mentorsWithApprovals = mentorsRes.rows.map((user) => {
      const approvedTopics = approvalsRes.rows
        .filter((a) => a.mentor_id === user.id)
        .map((a) => a.topic_id);
      return {
        ...user,
        approvedTopics,
      };
    });

    res.status(200).json({ mentors: mentorsWithApprovals });
  } catch (err) {
    next(err);
  }
});

// POST /api/teacher/mentors/toggle-topic
// Teacher grants or revokes topic approval for a mentor/learner
router.post('/mentors/toggle-topic', async (req, res, next) => {
  try {
    const { teacherId, mentorId, topicId } = req.body;

    // Verify teacher role
    const teacherCheck = await db.query('SELECT role FROM users WHERE id = $1', [teacherId]);
    if (teacherCheck.rows.length === 0 || teacherCheck.rows[0].role !== 'teacher') {
      return res.status(403).json({
        errorCode: 'TEACHER_ONLY',
        message: 'Only the course teacher can approve or revoke mentor permissions.',
      });
    }

    // Check existing approval
    const existing = await db.query(
      'SELECT id, revoked_at FROM mentor_approvals WHERE mentor_id = $1 AND topic_id = $2',
      [mentorId, topicId]
    );

    let actionTaken = '';
    const now = new Date().toISOString();

    if (existing.rows.length > 0 && existing.rows[0].revoked_at === null) {
      // Revoke permission
      await db.query(
        'UPDATE mentor_approvals SET revoked_at = $1 WHERE id = $2',
        [now, existing.rows[0].id]
      );
      actionTaken = 'REVOKED';
    } else if (existing.rows.length > 0 && existing.rows[0].revoked_at !== null) {
      // Re-grant permission
      await db.query(
        'UPDATE mentor_approvals SET granted_at = $1, revoked_at = NULL WHERE id = $2',
        [now, existing.rows[0].id]
      );
      // Promote role to mentor if currently learner
      await db.query(`UPDATE users SET role = 'mentor' WHERE id = $1 AND role = 'learner'`, [mentorId]);
      actionTaken = 'GRANTED';
    } else {
      // Grant new permission
      const approvalId = `appr-${Date.now()}`;
      await db.query(
        `INSERT INTO mentor_approvals (id, mentor_id, topic_id, granted_at)
         VALUES ($1, $2, $3, $4)`,
        [approvalId, mentorId, topicId, now]
      );
      // Promote role to mentor if currently learner
      await db.query(`UPDATE users SET role = 'mentor' WHERE id = $1 AND role = 'learner'`, [mentorId]);
      actionTaken = 'GRANTED';
    }

    // Record in Audit Log with timestamp
    await db.query(
      `INSERT INTO audit_logs (id, action, performed_by, target_user_id, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        `audit-${Date.now()}`,
        actionTaken === 'GRANTED' ? 'MENTOR_APPROVED' : 'MENTOR_REVOKED',
        teacherId,
        mentorId,
        JSON.stringify({ topicId, timestamp: now }),
      ]
    );

    res.status(200).json({
      message: `Mentor permission ${actionTaken.toLowerCase()} successfully.`,
      action: actionTaken,
      topicId,
      mentorId,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/teacher/reset-account
// Manual account reset performed by teacher with audit log
router.post('/reset-account', async (req, res, next) => {
  try {
    const { teacherId, targetUserId, newTemporaryPassword } = req.body;

    const teacherCheck = await db.query('SELECT role FROM users WHERE id = $1', [teacherId]);
    if (teacherCheck.rows.length === 0 || teacherCheck.rows[0].role !== 'teacher') {
      return res.status(403).json({
        errorCode: 'TEACHER_ONLY',
        message: 'Only the teacher can perform manual account resets.',
      });
    }

    const tempHash = `mock_hash_${newTemporaryPassword || 'hemma2026'}`;
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [tempHash, targetUserId]);

    // Record reset in audit log
    await db.query(
      `INSERT INTO audit_logs (id, action, performed_by, target_user_id, details)
       VALUES ($1, 'MANUAL_ACCOUNT_RESET', $2, $3, $4)`,
      [
        `audit-${Date.now()}`,
        teacherId,
        targetUserId,
        JSON.stringify({ resetAt: new Date().toISOString() }),
      ]
    );

    res.status(200).json({
      message: 'Account reset successfully. Temporary credentials generated.',
      targetUserId,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/teacher/purge-demo-data (NFR-14)
// Teacher endpoint to purge non-consented demo learners and their submissions/progress records
router.post('/purge-demo-data', async (req, res, next) => {
  try {
    const { teacherId } = req.body;

    // Verify teacher authorization
    const teacherCheck = await db.query('SELECT role FROM users WHERE id = $1', [teacherId]);
    if (teacherCheck.rows.length === 0 || teacherCheck.rows[0].role !== 'teacher') {
      return res.status(403).json({
        errorCode: 'TEACHER_ONLY',
        message: 'Only the course teacher can execute demo data purge operations.',
      });
    }

    // 1. Identify non-consented demo learners
    const nonConsentedLearners = await db.query(
      `SELECT id FROM users 
       WHERE role = 'learner' AND (consent_given IS NULL OR consent_given = FALSE)`
    );

    const targetLearnerIds = nonConsentedLearners.rows.map((u) => u.id);

    let purgedSubmissionsCount = 0;
    let purgedProgressCount = 0;

    if (targetLearnerIds.length > 0) {
      // Find matching submissions
      const subs = await db.query(
        `SELECT id FROM submissions WHERE learner_id = ANY($1::text[])`,
        [targetLearnerIds]
      );
      const subIds = subs.rows.map((s) => s.id);

      if (subIds.length > 0) {
        await db.query(`DELETE FROM feedbacks WHERE submission_id = ANY($1::text[])`, [subIds]);
        await db.query(`DELETE FROM review_assignments WHERE submission_id = ANY($1::text[])`, [subIds]);
        const delSubs = await db.query(`DELETE FROM submissions WHERE id = ANY($1::text[])`, [subIds]);
        purgedSubmissionsCount = delSubs.rowCount || subIds.length;
      }

      // Purge progress records
      const delProg = await db.query(
        `DELETE FROM progress_records WHERE learner_id = ANY($1::text[])`,
        [targetLearnerIds]
      );
      purgedProgressCount = delProg.rowCount || 0;
    }

    // Log the purge operation in the audit trail
    await db.query(
      `INSERT INTO audit_logs (id, action, performed_by, details)
       VALUES ($1, 'PURGE_DEMO_DATA', $2, $3)`,
      [
        `audit-${Date.now()}`,
        teacherId,
        JSON.stringify({
          purgedLearnersCount: targetLearnerIds.length,
          purgedSubmissionsCount,
          purgedProgressCount,
          purgedAt: new Date().toISOString(),
        }),
      ]
    );

    res.status(200).json({
      message: 'Non-consented demo data purged successfully according to NFR-14 retention policy.',
      purgedLearnersCount: targetLearnerIds.length,
      purgedSubmissionsCount,
      purgedProgressCount,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/teacher/audit-logs
router.get('/audit-logs', async (req, res, next) => {
  try {
    const logs = await db.query(
      `SELECT a.*, u1.name as performed_by_name, u2.name as target_user_name
       FROM audit_logs a
       JOIN users u1 ON a.performed_by = u1.id
       LEFT JOIN users u2 ON a.target_user_id = u2.id
       ORDER BY a.created_at DESC
       LIMIT 50`
    );
    res.status(200).json({ auditLogs: logs.rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

