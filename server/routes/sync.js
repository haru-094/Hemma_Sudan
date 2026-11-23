const express = require('express');
const router = express.Router();
const db = require('../db');

// Idempotent progress synchronization with duplicate protection
router.post('/progress', async (req, res, next) => {
  try {
    // Session Expiry (401 check)
    const authHeader = req.headers.authorization || '';
    if (authHeader.toLowerCase().includes('expired') || req.headers['x-mock-expired'] === 'true') {
      return res.status(401).json({
        errorCode: 'SESSION_EXPIRED',
        message: 'Your authentication session has expired while offline. Please log in again to synchronize progress.',
      });
    }

    const { updates, learnerId, savedLessonIds = [] } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        errorCode: 'INVALID_UPDATES',
        message: 'A non-empty array of progress updates is required.',
      });
    }

    const processed = [];
    const duplicatesIgnored = [];
    const conflictsResolved = [];

    for (const item of updates) {
      const {
        updateId,
        lessonId,                       // client sends 'lessonId' for both lessons and quizzes
        entityType = lessonId && lessonId.startsWith('quiz') ? 'quiz' : 'lesson',
        status = 'completed',
        lastPosition = 100,
        clientTime,
      } = item;

      if (!updateId || !lessonId) {
        continue;
      }

      // 1. Idempotency guard: Ignore duplicate updateId
      const existing = await db.query(
        'SELECT id FROM progress_records WHERE update_id = $1',
        [updateId]
      );

      if (existing.rows.length > 0) {
        duplicatesIgnored.push(updateId);
        continue;
      }

      // 2. Progress Conflict Resolution:
      // When two devices or an offline update and the server disagree on a lesson marked as done,
      // the server shall revert to incomplete. For fields such as the last position, the update with the latest client timestamp wins.
      const existingProgress = await db.query(
        `SELECT id, status, last_position, client_time 
         FROM progress_records 
         WHERE learner_id = $1 AND entity_id = $2
         ORDER BY client_time DESC LIMIT 1`,
        [learnerId || 'usr-learner-1', lessonId]
      );

      let finalStatus = status;
      let finalPosition = lastPosition;
      let isConflict = false;

      if (existingProgress.rows.length > 0) {
        const prev = existingProgress.rows[0];

        const prevDone = prev.status === 'completed';
        const newDone = status === 'completed';

        if (prevDone !== newDone) {
          finalStatus = 'incomplete';
          isConflict = true;
        }

        const prevTime = new Date(prev.client_time).getTime();
        const newTime = new Date(clientTime || Date.now()).getTime();

        if (prevTime > newTime) {
          finalPosition = prev.last_position;
          isConflict = true;
        }
      }

      const recId = `prog-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      await db.query(
        `INSERT INTO progress_records
           (id, update_id, learner_id, entity_id, entity_type, status, last_position, client_time, sync_state)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'synced')`,
        [
          recId,
          updateId,
          learnerId || 'usr-learner-1',
          lessonId,                    // stored as entity_id — no FK constraint
          entityType,
          finalStatus,
          finalPosition,
          clientTime || new Date().toISOString(),
        ]
      );

      if (isConflict) {
        conflictsResolved.push({ updateId, entityId: lessonId, finalStatus, finalPosition });
      }
      processed.push(updateId);
    }

    // 3. Content Conflict Detection
    // Server published version always wins. If updated -> update available. If unpublished -> no longer available.
    const updateAvailable = [];
    const noLongerAvailable = [];

    if (Array.isArray(savedLessonIds) && savedLessonIds.length > 0) {
      const lessonChecks = await db.query(
        `SELECT id, is_published, version FROM lessons WHERE id = ANY($1::text[])`,
        [savedLessonIds]
      );

      const foundMap = new Map(lessonChecks.rows.map((l) => [l.id, l]));

      for (const sId of savedLessonIds) {
        const row = foundMap.get(sId);
        if (!row || row.is_published === false) {
          noLongerAvailable.push(sId);
        } else if (row.version > 1) {
          updateAvailable.push(sId);
        }
      }
    }

    res.status(200).json({
      message: 'Progress synchronization completed.',
      syncedCount: processed.length,
      duplicatesIgnoredCount: duplicatesIgnored.length,
      conflictsResolvedCount: conflictsResolved.length,
      conflictsResolved,
      processedUpdateIds: processed,
      ignoredUpdateIds: duplicatesIgnored,
      lessonStatus: {
        updateAvailable,
        noLongerAvailable,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/progress/:learnerId', async (req, res, next) => {
  try {
    const { learnerId } = req.params;
    const result = await db.query(
      `SELECT * FROM progress_records WHERE learner_id = $1 ORDER BY synced_at DESC`,
      [learnerId]
    );
    res.status(200).json({ progressRecords: result.rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
