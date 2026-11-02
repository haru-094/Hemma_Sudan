const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/topics - List all modules with nested lessons, quizzes, and assignments
router.get('/topics', async (req, res, next) => {
  try {
    const topicsResult = await db.query(
      `SELECT id, title_en, title_ar, description_en, description_ar, display_order, teacher_id
       FROM topics 
       ORDER BY display_order ASC`
    );

    const lessonsResult = await db.query(
      `SELECT id, topic_id, display_order, title_en, title_ar, notes_en, notes_ar, code_snippet, arabic_status, recording_link, is_published, version
       FROM lessons 
       WHERE is_published = TRUE 
       ORDER BY display_order ASC`
    );

    const quizzesResult = await db.query(
      `SELECT id, topic_id, title_en, title_ar, questions 
       FROM topic_quizzes`
    );

    const assignmentsResult = await db.query(
      `SELECT id, topic_id, title_en, title_ar, prompt_en, prompt_ar 
       FROM topic_assignments`
    );

    // Group items into coherent topic bundles
    const topics = topicsResult.rows.map((topic) => {
      return {
        ...topic,
        lessons: lessonsResult.rows.filter((l) => l.topic_id === topic.id),
        quiz: quizzesResult.rows.find((q) => q.topic_id === topic.id) || null,
        assignment: assignmentsResult.rows.find((a) => a.topic_id === topic.id) || null,
      };
    });

    res.status(200).json({ topics });
  } catch (err) {
    next(err);
  }
});

// GET /api/lessons/:id - Fetch single lesson package
router.get('/lessons/:id', async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT l.*, t.title_en as topic_title_en, t.title_ar as topic_title_ar 
       FROM lessons l 
       JOIN topics t ON l.topic_id = t.id 
       WHERE l.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        errorCode: 'LESSON_NOT_FOUND',
        message: 'The requested lesson does not exist.',
      });
    }

    res.status(200).json({ lesson: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// POST /api/lessons - Teacher creates new lesson (FR-2.1)
router.post('/lessons', async (req, res, next) => {
  try {
    const {
      topicId,
      titleEn,
      titleAr,
      notesEn,
      notesAr,
      codeSnippet,
      recordingLink,
      arabicStatus = 'draft',
    } = req.body;

    if (!topicId || !titleEn || !notesEn || !codeSnippet) {
      return res.status(400).json({
        errorCode: 'INVALID_LESSON_INPUT',
        message: 'Topic ID, title, notes, and code snippet are required.',
      });
    }

    const newId = `lesson-${Date.now()}`;
    const result = await db.query(
      `INSERT INTO lessons (id, topic_id, title_en, title_ar, notes_en, notes_ar, code_snippet, recording_link, arabic_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [newId, topicId, titleEn, titleAr || titleEn, notesEn, notesAr || notesEn, codeSnippet, recordingLink || null, arabicStatus]
    );

    res.status(201).json({ lesson: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

