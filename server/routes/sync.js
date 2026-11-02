const express = require('express');
const router = express.Router();
const db = require('../db');

// Idempotent progress synchronization with duplicate protection (FR-5.4)
router.post('/progress', async (req, res, next) => {
  try {
    const { updates, learnerId } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        errorCode: 'INVALID_UPDATES',
        message: 'A non-empty array of progress updates is required.',
      });
    }

    const processed = [];
    const duplicatesIgnored = [];

    for (const item of updates) {
      const { updateId, lessonId, status = 'completed', lastPosition = 100, clientTime } = item;

      if (!updateId || !lessonId) {
        continue;
      }

      // Ignore duplicate updateId per FR-5.4
      const existing = await db.query(
        'SELECT id FROM progress_records WHERE update_id = $1',
        [updateId]
      );

      if (existing.rows.length > 0) {
        duplicatesIgnored.push(updateId);
        continue;
      }

      const recId = `prog-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      await db.query(
        `INSERT INTO progress_records (id, update_id, learner_id, lesson_id, status, last_position, client_time, sync_state)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'synced')`,
        [recId, updateId, learnerId || 'usr-learner-1', status, lastPosition, clientTime || new Date().toISOString()]
      );

      processed.push(updateId);
    }

    res.status(200).json({
      message: 'Progress synchronization completed.',
      syncedCount: processed.length,
      duplicatesIgnoredCount: duplicatesIgnored.length,
      processedUpdateIds: processed,
      ignoredUpdateIds: duplicatesIgnored,
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
