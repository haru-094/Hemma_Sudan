const fs = require('fs');
const path = require('path');
const db = require('./db');

const SEED_USERS = [
  {
    id: 'usr-teacher-1',
    name: 'Dr. Tariq Ahmed',
    email: 'teacher@hemma.sd',
    passwordHash: 'mock_hash',
    role: 'teacher',
    courseTitle: 'Introduction to Computer Science & Python',
    language: 'en',
  },
  {
    id: 'usr-mentor-1',
    name: 'Sarah Ibrahim',
    email: 'sarah.mentor@hemma.sd',
    passwordHash: 'mock_hash',
    role: 'mentor',
    university: 'University of Khartoum',
    language: 'en',
  },
  {
    id: 'usr-mentor-2',
    name: 'Omar Farouk',
    email: 'omar.mentor@hemma.sd',
    passwordHash: 'mock_hash',
    role: 'mentor',
    university: 'Sudan University of Science and Technology',
    language: 'ar',
  },
  {
    id: 'usr-mentor-3',
    name: 'Mona Elhassan',
    email: 'mona.mentor@hemma.sd',
    passwordHash: 'mock_hash',
    role: 'mentor',
    university: 'Al-Neelain University',
    language: 'en',
  },
  {
    id: 'usr-learner-1',
    name: 'Ahmed Osman',
    email: 'ahmed.student@hemma.sd',
    passwordHash: 'mock_hash',
    role: 'learner',
    university: 'University of Khartoum',
    ageConfirmed: true,
    language: 'en',
  },
];

const SEED_TOPICS = [
  {
    id: 'topic-1',
    titleEn: '1. Python Fundamentals & Input Processing',
    titleAr: '١. أساسيات لغة بايثون ومعالجة المدخلات',
    descriptionEn: 'Variables, data types, arithmetic operators, string formatting, and terminal input.',
    descriptionAr: 'المتغيرات، أنواع البيانات، العمليات الحسابية، تنسيق النصوص، ومدخلات الطرفية.',
    displayOrder: 1,
    teacherId: 'usr-teacher-1',
  },
  {
    id: 'topic-2',
    titleEn: '2. Control Flow, Conditionals & Loops',
    titleAr: '٢. تدفق التحكم، الشروط، والتكرار (الحلقات)',
    descriptionEn: 'Making decisions with if/elif/else and automating repetitions with while and for loops.',
    descriptionAr: 'اتخاذ القرارات عبر if/elif/else وتكرار العمليات عبر حلقات for و while.',
    displayOrder: 2,
    teacherId: 'usr-teacher-1',
  },
  {
    id: 'topic-3',
    titleEn: '3. Functions, Modular Design & Scope',
    titleAr: '٣. الدوال، التصميم المعياري، ونطاق المتغيرات',
    descriptionEn: 'Decomposing problems into reusable functions, default parameters, and pure functions.',
    descriptionAr: 'تقسيم المشاكل البرمجية إلى دوال قابلة لإعادة الاستخدام، المعاملات، والنطاق.',
    displayOrder: 3,
    teacherId: 'usr-teacher-1',
  },
];

const SEED_LESSONS = [
  {
    id: 'lesson-1',
    topicId: 'topic-1',
    displayOrder: 1,
    titleEn: 'Variables, Arithmetic & User Input',
    titleAr: 'المتغيرات، العمليات الحسابية، ومدخلات المستخدم',
    notesEn: 'Variables store values in memory. Use input() to capture terminal data. Operations: +, -, *, /, //, %',
    notesAr: 'المتغيرات تخزن القيم في الذاكرة. استخدام input() لاستقبال المدخلات من الطرفية. العمليات: +, -, *, /, //, %',
    codeSnippet: 'user_name = input("Enter your name: ")\nstudy_hours = int(input("Study hours/week? "))\nprint(f"Daily target: {study_hours/7:.2f} hrs")',
    arabicStatus: 'approved',
    recordingLink: 'https://meet.google.com/xyz-hemma-demo',
  },
  {
    id: 'lesson-2',
    topicId: 'topic-1',
    displayOrder: 2,
    titleEn: 'Strings, Formatting & Type Conversion',
    titleAr: 'النصوص، التنسيق، والتحويل بين الأنواع',
    notesEn: 'Strings are sequences of characters. Format with f-strings for clean output.',
    notesAr: 'النصوص في بايثون عبارة عن تسلسل من الأحرف. يمكن التنسيق باستخدام f-strings.',
    codeSnippet: 'city = "Khartoum"\ntemp = 38.5\nprint(f"Temperature in {city}: {temp}°C")',
    arabicStatus: 'approved',
    recordingLink: 'https://meet.google.com/xyz-hemma-demo-2',
  },
  {
    id: 'lesson-3',
    topicId: 'topic-2',
    displayOrder: 1,
    titleEn: 'Conditional Statements (if, elif, else)',
    titleAr: 'الجمل الشرطية (if, elif, else)',
    notesEn: 'Branch code execution based on boolean truth values.',
    notesAr: 'تتيح الجمل الشرطية اتخاذ مسارات مختلفة بناءً على تقييم الشروط المنطقية.',
    codeSnippet: 'score = int(input("Score: "))\nif score >= 60:\n    print("Pass")\nelse:\n    print("Needs Improvement")',
    arabicStatus: 'approved',
    recordingLink: 'https://meet.google.com/xyz-hemma-demo-3',
  },
  {
    id: 'lesson-4',
    topicId: 'topic-2',
    displayOrder: 2,
    titleEn: 'Loops and Iterations (while & for)',
    titleAr: 'حلقات التكرار (while و for)',
    notesEn: 'For loop over sequences; while loop repeats while condition is True.',
    notesAr: 'حلقات for للتكرار على العناصر، و while للتكرار ما دام الشرط صحيحاً.',
    codeSnippet: 'for i in range(1, 6):\n    print(f"Step {i}")',
    arabicStatus: 'approved',
    recordingLink: 'https://meet.google.com/xyz-hemma-demo-4',
  },
  {
    id: 'lesson-5',
    topicId: 'topic-3',
    displayOrder: 1,
    titleEn: 'Defining Reusable Functions & Scope',
    titleAr: 'تعريف الدوال القابلة لإعادة الاستخدام ونطاق المتغيرات',
    notesEn: 'Functions decompose problems into reusable testable units.',
    notesAr: 'الدوال تقسم المشاكل إلى أجزاء سهلة الفحص وإعادة الاستخدام.',
    codeSnippet: 'def add(a, b):\n    return a + b\nprint(add(5, 7))',
    arabicStatus: 'approved',
    recordingLink: 'https://meet.google.com/xyz-hemma-demo-5',
  },
];

const SEED_MENTOR_APPROVALS = [
  { id: 'appr-1', mentorId: 'usr-mentor-1', topicId: 'topic-1' },
  { id: 'appr-2', mentorId: 'usr-mentor-1', topicId: 'topic-2' },
  { id: 'appr-3', mentorId: 'usr-mentor-2', topicId: 'topic-2' },
  { id: 'appr-4', mentorId: 'usr-mentor-2', topicId: 'topic-3' },
  { id: 'appr-5', mentorId: 'usr-mentor-3', topicId: 'topic-1' },
];

async function seedDatabase() {
  console.log('Beginning database migration and seed...');
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await db.query(schemaSql);
    console.log('✓ Database schema tables verified/created successfully.');

    for (const u of SEED_USERS) {
      await db.query(
        `INSERT INTO users (id, name, email, password_hash, role, language, university, age_confirmed, course_title)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email;`,
        [u.id, u.name, u.email, u.passwordHash, u.role, u.language, u.university || null, u.ageConfirmed || false, u.courseTitle || null]
      );
    }

    for (const t of SEED_TOPICS) {
      await db.query(
        `INSERT INTO topics (id, title_en, title_ar, description_en, description_ar, display_order, teacher_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING;`,
        [t.id, t.titleEn, t.titleAr, t.descriptionEn, t.descriptionAr, t.displayOrder, t.teacherId]
      );
    }

    for (const l of SEED_LESSONS) {
      await db.query(
        `INSERT INTO lessons (id, topic_id, display_order, title_en, title_ar, notes_en, notes_ar, code_snippet, arabic_status, recording_link)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO NOTHING;`,
        [l.id, l.topicId, l.displayOrder, l.titleEn, l.titleAr, l.notesEn, l.notesAr, l.codeSnippet, l.arabicStatus, l.recordingLink]
      );
    }

    for (const a of SEED_MENTOR_APPROVALS) {
      await db.query(
        `INSERT INTO mentor_approvals (id, mentor_id, topic_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (mentor_id, topic_id) DO NOTHING;`,
        [a.id, a.mentorId, a.topicId]
      );
    }

    console.log('✓ Seed completed successfully!');
  } catch (err) {
    console.error('Database migration/seed error:', err.message);
  } finally {
    await db.pool.end();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
