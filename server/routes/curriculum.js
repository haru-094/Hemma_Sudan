const express = require('express');
const router = express.Router();
const db = require('../db');

// Translation helper: Calls LibreTranslate service or generates smart draft fallback
async function translateText(text, source = 'en', target = 'ar') {
  const libreUrl = process.env.LIBRETRANSLATE_URL || 'http://localhost:5000';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${libreUrl}/translate`, {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source,
        target,
        format: 'text',
      }),
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { translatedText: data.translatedText, source: 'libretranslate' };
    }
  } catch (err) {
    // LibreTranslate service unreachable or timed out
  }

  // Fallback translation helper for common programming terms
  const dictionary = {
    'Introduction to': 'مقدمة في',
    'Variables': 'المتغيرات',
    'Functions': 'الدوال',
    'Loops': 'حلقات التكرار',
    'Conditionals': 'الشروط',
    'Data Types': 'أنواع البيانات',
    'Lists': 'القوائم',
    'Dictionaries': 'القواميس',
    'Strings': 'النصوص',
  };

  let fallback = text;
  Object.entries(dictionary).forEach(([en, ar]) => {
    fallback = fallback.replace(new RegExp(en, 'gi'), ar);
  });

  return { translatedText: fallback, source: 'fallback_draft' };
}

// POST /api/translate/draft - Generates an Arabic translation draft for English lesson content
router.post('/translate/draft', async (req, res, next) => {
  try {
    const { titleEn, notesEn } = req.body;

    if (!titleEn && !notesEn) {
      return res.status(400).json({
        errorCode: 'MISSING_TEXT',
        message: 'English title or notes required for translation draft.',
      });
    }

    const titleResult = titleEn ? await translateText(titleEn) : { translatedText: '' };
    const notesResult = notesEn ? await translateText(notesEn) : { translatedText: '' };

    res.status(200).json({
      titleArDraft: titleResult.translatedText,
      notesArDraft: notesResult.translatedText,
      serviceAvailable: titleResult.source === 'libretranslate',
    });
  } catch (err) {
    next(err);
  }
});

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

// POST /api/lessons - Teacher creates new lesson with English and optional Arabic draft approval
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
      arabicStatus = 'draft', // 'draft' | 'approved' | 'pending'
    } = req.body;

    if (!topicId || !titleEn || !notesEn || !codeSnippet) {
      return res.status(400).json({
        errorCode: 'INVALID_LESSON_INPUT',
        message: 'Topic ID, title, notes, and code snippet are required.',
      });
    }

    // Get max display order for topic with robust fallback
    let nextOrder = 1;
    try {
      const orderRes = await db.query(
        `SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order FROM lessons WHERE topic_id = $1`,
        [topicId]
      );
      if (orderRes?.rows?.[0]?.next_order != null) {
        nextOrder = parseInt(orderRes.rows[0].next_order, 10) || 1;
      }
    } catch {
      nextOrder = 1;
    }

    const newId = `lesson-${Date.now()}`;
    const result = await db.query(
      `INSERT INTO lessons (id, topic_id, display_order, title_en, title_ar, notes_en, notes_ar, code_snippet, recording_link, arabic_status, is_published, version)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, TRUE, 1)
       RETURNING *`,
      [
        newId,
        topicId,
        nextOrder,
        titleEn.trim(),
        (titleAr || titleEn).trim(),
        notesEn.trim(),
        (notesAr || notesEn).trim(),
        codeSnippet.trim(),
        recordingLink ? recordingLink.trim() : null,
        arabicStatus,
      ]
    );

    res.status(201).json({ lesson: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/lessons/:id/arabic-status - Teacher approves or marks Arabic translation draft
router.patch('/lessons/:id/arabic-status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { arabicStatus, titleAr, notesAr } = req.body;

    const updateFields = [];
    const params = [id];

    if (arabicStatus) {
      params.push(arabicStatus);
      updateFields.push(`arabic_status = $${params.length}`);
    }
    if (titleAr) {
      params.push(titleAr.trim());
      updateFields.push(`title_ar = $${params.length}`);
    }
    if (notesAr) {
      params.push(notesAr.trim());
      updateFields.push(`notes_ar = $${params.length}`);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ errorCode: 'NO_UPDATES', message: 'No update data provided.' });
    }

    const result = await db.query(
      `UPDATE lessons SET ${updateFields.join(', ')} WHERE id = $1 RETURNING *`,
      params
    );

    res.status(200).json({ lesson: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
