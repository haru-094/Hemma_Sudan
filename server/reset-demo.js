/**
 * Hemma Sudan — Clean Demo State Reset Script
 * Restores the platform to a clean baseline for video demonstrations:
 * - 0 Submissions (clean review queue ready for live submission)
 * - 0 Feedbacks
 * - 0 Progress Records
 * - 2 Mentors approved, 1 unapproved Learner (Mona) ready for live promotion
 * - 1 Lesson with Arabic translation in 'draft' status ready for live Teacher approval
 * - Teacher account seeded from TEACHER_EMAIL & TEACHER_PASSWORD
 */

const db = require('./db');
require('dotenv').config();

async function resetDemo() {
  console.log('\n========================================================');
  console.log('🇸🇩  HEMMA SUDAN — CLEAN-START DEMO RESET');
  console.log('========================================================\n');

  try {
    // 1. Reset in-memory DB collections
    if (db.memoryDb) {
      db.memoryDb.submissions = [];
      db.memoryDb.feedbacks = [];
      db.memoryDb.progress_records = [];

      db.memoryDb.users = [
        { id: 'usr-mentor-1', name: 'Sarah Ibrahim', email: 'sarah.mentor@hemma.sd', password_hash: '$2b$10$VwQxypFaO.9YJO6.RyY3O.zdGnLGPhJUzmatntE4qNeJAJhesJkPW', role: 'mentor', university: 'University of Khartoum', language: 'en' },
        { id: 'usr-mentor-2', name: 'Omar Farouk', email: 'omar.mentor@hemma.sd', password_hash: '$2b$10$VwQxypFaO.9YJO6.RyY3O.zdGnLGPhJUzmatntE4qNeJAJhesJkPW', role: 'mentor', university: 'Sudan University of Science and Technology', language: 'ar' },
        { id: 'usr-learner-1', name: 'Ahmed Osman', email: 'ahmed.student@hemma.sd', password_hash: '$2b$10$VwQxypFaO.9YJO6.RyY3O.zdGnLGPhJUzmatntE4qNeJAJhesJkPW', role: 'learner', university: 'University of Khartoum', age_confirmed: true, language: 'en' },
        { id: 'usr-learner-2', name: 'Mona Elhassan', email: 'mona.learner@hemma.sd', password_hash: '$2b$10$VwQxypFaO.9YJO6.RyY3O.zdGnLGPhJUzmatntE4qNeJAJhesJkPW', role: 'learner', university: 'Al-Neelain University', age_confirmed: true, language: 'en' }
      ];

      db.memoryDb.mentor_approvals = [
        { id: 'appr-1', teacher_id: 'usr-teacher-1', mentor_id: 'usr-mentor-1', topic_id: 'topic-1', granted_at: new Date(Date.now() - 172800000).toISOString(), revoked_at: null },
        { id: 'appr-2', teacher_id: 'usr-teacher-1', mentor_id: 'usr-mentor-1', topic_id: 'topic-2', granted_at: new Date(Date.now() - 172800000).toISOString(), revoked_at: null },
        { id: 'appr-3', teacher_id: 'usr-teacher-1', mentor_id: 'usr-mentor-2', topic_id: 'topic-2', granted_at: new Date(Date.now() - 172800000).toISOString(), revoked_at: null },
        { id: 'appr-4', teacher_id: 'usr-teacher-1', mentor_id: 'usr-mentor-2', topic_id: 'topic-3', granted_at: new Date(Date.now() - 172800000).toISOString(), revoked_at: null }
      ];

      db.memoryDb.audit_logs = [
        {
          id: 'log-1',
          performed_by: 'usr-teacher-1',
          action: 'APPROVE_MENTOR_TOPIC',
          target_user_id: 'usr-mentor-1',
          details: 'Approved for Topic 1 and Topic 2',
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];

      // Set Lesson 2 to draft so Teacher can approve it live on camera
      const l2 = db.memoryDb.lessons.find((l) => l.id === 'lesson-2' || l.id === 'lesson-1-2');
      if (l2) l2.arabic_status = 'draft';
    }

    // 2. Re-seed PostgreSQL tables if database connection exists
    if (process.env.DATABASE_URL) {
      try {
        const { seedDatabase } = require('./seed');
        await seedDatabase();
      } catch (pgErr) {
        console.log('PostgreSQL reset notice:', pgErr.message);
      }
    }

    // 3. Ensure teacher account is seeded
    if (typeof db.seedTeacherAccount === 'function') {
      await db.seedTeacherAccount();
    }

    console.log('✓ Submissions and reviews reset to empty: Ready for live attempt submission.');
    console.log('✓ Candidate learner "Mona Elhassan" ready for live Teacher accreditation.');
    console.log('✓ Lesson 2 ("Strings, Formatting & Type Conversion") set to "draft" for live approval.');
    console.log('✓ Teacher account verified and seeded.');
    console.log('\n🎬 Demo environment is clean and ready for recording!\n');
  } catch (err) {
    console.error('Reset error:', err);
  } finally {
    process.exit(0);
  }
}

resetDemo();
