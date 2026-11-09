const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/teacher/mentors - Get all mentors with their approved topics (FR-8.1, FR-8.2)
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

// POST /api/teacher/mentors/toggle-topic (FR-8.2, FR-8.3, BR-2 & NFR-13 Auditability)
// Teacher grants or revokes topic approval for a mentor/learner
router.post('/mentors/toggle-topic', async (req, res, next) => {
  try {
    const { teacherId, mentorId, topicId } = req.body;

    // Verify teacher role (BR-2)
    const teacherCheck = await db.query('SELECT role FROM users WHERE id = $1', [teacherId]);
    if (teacherCheck.rows.length === 0 || teacherCheck.rows[0].role !== 'teacher') {
      return res.status(403).json({
        errorCode: 'TEACHER_ONLY',
        message: 'Only the course teacher can approve or revoke mentor permissions (BR-2).',
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
      // Revoke permission (FR-8.3)
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
      // Grant new permission (FR-8.2)
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

    // Record in Audit Log with timestamp (NFR-13)
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

// POST /api/teacher/reset-account (FR-13.1 & NFR-13)
// Manual account reset performed by teacher with audit log
router.post('/reset-account', async (req, res, next) => {
  try {
    const { teacherId, targetUserId, newTemporaryPassword } = req.body;

    const teacherCheck = await db.query('SELECT role FROM users WHERE id = $1', [teacherId]);
    if (teacherCheck.rows.length === 0 || teacherCheck.rows[0].role !== 'teacher') {
      return res.status(403).json({
        errorCode: 'TEACHER_ONLY',
        message: 'Only the teacher can perform manual account resets (FR-13.1, BR-7).',
      });
    }

    const tempHash = `mock_hash_${newTemporaryPassword || 'hemma2026'}`;
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [tempHash, targetUserId]);

    // Record reset in audit log (NFR-13)
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

// GET /api/teacher/audit-logs (NFR-13)
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

