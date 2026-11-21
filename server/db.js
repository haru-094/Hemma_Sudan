const { Pool } = require('pg');
require('dotenv').config();

let usePostgres = true;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/hemma_sudan',
  connectionTimeoutMillis: 1200,
  ssl: process.env.DATABASE_URL && process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

pool.on('error', () => {
  // Suppress uncaught idle connection errors
});

// In-Memory Fallback Store (active when PostgreSQL server is offline or in development/testing)
const memoryDb = {
  users: [
    { id: 'usr-teacher-1', name: 'Dr. Tariq Ahmed', email: 'teacher@hemma.sd', password_hash: 'mock_hash', role: 'teacher', course_title: 'Introduction to Computer Science & Python', language: 'en' },
    { id: 'usr-mentor-1', name: 'Sarah Ibrahim', email: 'sarah.mentor@hemma.sd', password_hash: 'mock_hash', role: 'mentor', university: 'University of Khartoum', language: 'en' },
    { id: 'usr-mentor-2', name: 'Omar Farouk', email: 'omar.mentor@hemma.sd', password_hash: 'mock_hash', role: 'mentor', university: 'Sudan University of Science and Technology', language: 'ar' },
    { id: 'usr-mentor-3', name: 'Mona Elhassan', email: 'mona.mentor@hemma.sd', password_hash: 'mock_hash', role: 'mentor', university: 'Al-Neelain University', language: 'en' },
    { id: 'usr-learner-1', name: 'Ahmed Osman', email: 'ahmed.student@hemma.sd', password_hash: 'mock_hash', role: 'learner', university: 'University of Khartoum', age_confirmed: true, language: 'en' }
  ],
  topics: [
    { id: 'topic-1', title_en: '1. Python Fundamentals & Input Processing', title_ar: '١. أساسيات لغة بايثون ومعالجة المدخلات', description_en: 'Variables, data types, arithmetic operators, string formatting, and terminal input.', description_ar: 'المتغيرات، أنواع البيانات، العمليات الحسابية، تنسيق النصوص، ومدخلات الطرفية.', display_order: 1 },
    { id: 'topic-2', title_en: '2. Control Flow, Decisions & Repetition', title_ar: '٢. التحكم البرمجي، القرارات والتكرار', description_en: 'Conditional statements (if/elif/else), comparison operators, while loops, and for loops.', description_ar: 'الجمل الشرطية (if/elif/else)، معاملات المقارنة، حلقات while، وحلقات for.', display_order: 2 },
    { id: 'topic-3', title_en: '3. Data Structures & Modular Functions', title_ar: '٣. هياكل البيانات والدوال البرمجية', description_en: 'Lists, dictionaries, tuples, custom functions, parameter passing, and return values.', description_ar: 'القوائم، القواميس، المجموعات، الدوال المخصصة، تمرير المعاملات، والقيم المرجعة.', display_order: 3 }
  ],
  lessons: [
    { id: 'lesson-1-1', topic_id: 'topic-1', title_en: 'Variables, Expressions & Print Output', title_ar: 'المتغيرات، التعبيرات الحسابية ودالة الطباعة', notes_en: 'Understanding how variables hold values in memory.', notes_ar: 'فهم كيفية تخزين القيم في الذاكرة.', code_snippet: 'rate = 2600.0\nprint(f"USD to SDG: {rate}")', recording_link: 'https://youtu.be/mock-lesson-1', display_order: 1, arabic_status: 'approved' },
    { id: 'lesson-1-2', topic_id: 'topic-1', title_en: 'Console Input & Type Conversions', title_ar: 'مدخلات الطرفية وتحويل أنواع البيانات', notes_en: 'Interactive programs using input().', notes_ar: 'البرامج التفاعلية باستخدام input().', code_snippet: 'name = input("Enter name: ")\nprint(f"Marhaban, {name}!")', recording_link: 'https://youtu.be/mock-lesson-2', display_order: 2, arabic_status: 'approved' },
    { id: 'lesson-2-1', topic_id: 'topic-2', title_en: 'Conditional Logic & Decisions', title_ar: 'المنطق الشرطي واتخاذ القرارات', notes_en: 'Branching execution paths.', notes_ar: 'المسارات الشرطية والتفرع.', code_snippet: 'score = 85\nif score >= 60:\n    print("Passed")', recording_link: 'https://youtu.be/mock-lesson-3', display_order: 1, arabic_status: 'approved' },
    { id: 'lesson-2-2', topic_id: 'topic-2', title_en: 'Loops & Accumulator Patterns', title_ar: 'حلقات التكرار ونمط المجمّع', notes_en: 'Repeating calculations with for and while.', notes_ar: 'تكرار العمليات عبر for و while.', code_snippet: 'total = sum([10, 20, 30])\nprint(total)', recording_link: 'https://youtu.be/mock-lesson-4', display_order: 2, arabic_status: 'approved' },
    { id: 'lesson-3-1', topic_id: 'topic-3', title_en: 'Lists & Sequences Operations', title_ar: 'القوائم والعمليات على التسلسلات', notes_en: 'Storing ordered collections.', notes_ar: 'تخزين المجموعات المرتبة.', code_snippet: 'cities = ["Khartoum", "Omdurman"]\nprint(cities[0])', recording_link: 'https://youtu.be/mock-lesson-5', display_order: 1, arabic_status: 'approved' },
    { id: 'lesson-3-2', topic_id: 'topic-3', title_en: 'Functions, Scopes & Return Values', title_ar: 'الدوال البرمجية، النطاق والقيم المرجعة', notes_en: 'Writing modular code with def.', notes_ar: 'كتابة شيفرة قابلة لإعادة الاستخدام.', code_snippet: 'def greet(name):\n    return f"Salam, {name}"\nprint(greet("Ahmed"))', recording_link: 'https://youtu.be/mock-lesson-6', display_order: 2, arabic_status: 'approved' }
  ],
  mentor_approvals: [
    { teacher_id: 'usr-teacher-1', mentor_id: 'usr-mentor-1', topic_id: 'topic-1' },
    { teacher_id: 'usr-teacher-1', mentor_id: 'usr-mentor-1', topic_id: 'topic-2' },
    { teacher_id: 'usr-teacher-1', mentor_id: 'usr-mentor-2', topic_id: 'topic-2' },
    { teacher_id: 'usr-teacher-1', mentor_id: 'usr-mentor-2', topic_id: 'topic-3' },
    { teacher_id: 'usr-teacher-1', mentor_id: 'usr-mentor-3', topic_id: 'topic-1' }
  ],
  submissions: [
    {
      id: 'sub-101',
      topic_id: 'topic-1',
      learner_id: 'usr-learner-1',
      github_link: 'https://github.com/ahmed-osman/hemma-currency-converter',
      explanation: 'Built interactive console currency converter supporting SDG, USD, and SAR conversions with validation.',
      attempt_no: 1,
      status: 'feedback_given',
      submitted_at: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  feedbacks: [
    {
      id: 'fb-201',
      submission_id: 'sub-101',
      author_id: 'usr-mentor-1',
      comment: 'Excellent work! The input validation and currency formatting are well implemented.',
      kind: 'comment',
      created_at: new Date(Date.now() - 43200000).toISOString()
    }
  ],
  audit_logs: [
    {
      id: 'log-1',
      actor_id: 'usr-teacher-1',
      action: 'APPROVE_MENTOR_TOPIC',
      target_user_id: 'usr-mentor-1',
      details: 'Approved for Topic 1 and Topic 2',
      created_at: new Date(Date.now() - 172800000).toISOString()
    }
  ],
  progress_records: []
};

// Emulated Query Handler for In-Memory Fallback
function runMemoryQuery(text, params = []) {
  const normalized = text.trim().toLowerCase();

  // SELECT users
  if (normalized.startsWith('select') && normalized.includes('from users')) {
    if (normalized.includes('where email = $1')) {
      const u = memoryDb.users.find((user) => user.email === params[0]);
      return { rows: u ? [u] : [] };
    }
    if (normalized.includes('where id = $1')) {
      const u = memoryDb.users.find((user) => user.id === params[0]);
      return { rows: u ? [u] : [] };
    }
    if (normalized.includes("role = 'mentor'")) {
      const mentors = memoryDb.users.filter((user) => user.role === 'mentor');
      return { rows: mentors };
    }
    return { rows: memoryDb.users };
  }

  // SELECT topics
  if (normalized.startsWith('select') && normalized.includes('from topics')) {
    return { rows: memoryDb.topics };
  }

  // SELECT lessons
  if (normalized.startsWith('select') && normalized.includes('from lessons')) {
    if (normalized.includes('where id = $1')) {
      const l = memoryDb.lessons.find((less) => less.id === params[0]);
      return { rows: l ? [l] : [] };
    }
    if (normalized.includes('where topic_id = $1')) {
      const ls = memoryDb.lessons.filter((less) => less.topic_id === params[0]);
      return { rows: ls };
    }
    return { rows: memoryDb.lessons };
  }

  // SELECT mentor_approvals
  if (normalized.startsWith('select') && normalized.includes('from mentor_approvals')) {
    if (normalized.includes('where mentor_id = $1')) {
      const apps = memoryDb.mentor_approvals.filter((a) => a.mentor_id === params[0]);
      return { rows: apps };
    }
    return { rows: memoryDb.mentor_approvals };
  }

  // SELECT submissions
  if (normalized.startsWith('select') && normalized.includes('from submissions')) {
    if (normalized.includes('where s.id = $1') || normalized.includes('where id = $1')) {
      const s = memoryDb.submissions.find((sub) => sub.id === params[0]);
      return { rows: s ? [s] : [] };
    }
    if (normalized.includes('max(attempt_no)')) {
      const topicSubs = memoryDb.submissions.filter((s) => s.topic_id === params[0] && s.learner_id === params[1]);
      const maxAtt = topicSubs.reduce((max, s) => Math.max(max, s.attempt_no), 0);
      return { rows: [{ max_attempt: maxAtt }] };
    }
    const mapped = memoryDb.submissions.map((s) => {
      const learner = memoryDb.users.find((u) => u.id === s.learner_id);
      const topic = memoryDb.topics.find((t) => t.id === s.topic_id);
      return {
        ...s,
        learner_name: learner ? learner.name : 'Unknown Learner',
        learner_university: learner ? learner.university : 'University of Khartoum',
        topic_title_en: topic ? topic.title_en : 'Module Capstone',
        topic_title_ar: topic ? topic.title_ar : 'مشروع المحور'
      };
    });
    return { rows: mapped };
  }

  // SELECT feedbacks
  if (normalized.startsWith('select') && normalized.includes('from feedbacks')) {
    const mapped = memoryDb.feedbacks.map((f) => {
      const author = memoryDb.users.find((u) => u.id === f.author_id);
      return {
        ...f,
        author_name: author ? author.name : 'Reviewer',
        author_role: author ? author.role : 'mentor'
      };
    });
    return { rows: mapped };
  }

  // SELECT audit_logs
  if (normalized.startsWith('select') && normalized.includes('from audit_logs')) {
    return { rows: memoryDb.audit_logs };
  }

  // INSERT INTO submissions
  if (normalized.startsWith('insert into submissions')) {
    const newSub = {
      id: params[0],
      topic_id: params[1],
      learner_id: params[2],
      github_link: params[3],
      explanation: params[4],
      attempt_no: params[5],
      status: 'submitted',
      submitted_at: new Date().toISOString()
    };
    memoryDb.submissions.push(newSub);
    return { rows: [newSub] };
  }

  // INSERT INTO feedbacks
  if (normalized.startsWith('insert into feedbacks')) {
    const newFb = {
      id: params[0],
      submission_id: params[1],
      author_id: params[2],
      comment: params[3],
      kind: params[4],
      created_at: new Date().toISOString()
    };
    memoryDb.feedbacks.push(newFb);
    return { rows: [newFb] };
  }

  // UPDATE submissions
  if (normalized.startsWith('update submissions set status = $1 where id = $2')) {
    const sub = memoryDb.submissions.find((s) => s.id === params[1]);
    if (sub) sub.status = params[0];
    return { rows: [sub || { id: params[1], status: params[0] }] };
  }
  if (normalized.startsWith("update submissions set status = 'escalated' where id = $1")) {
    const sub = memoryDb.submissions.find((s) => s.id === params[0]);
    if (sub) sub.status = 'escalated';
    return { rows: [sub || { id: params[0], status: 'escalated' }] };
  }

  // INSERT INTO audit_logs
  if (normalized.startsWith('insert into audit_logs')) {
    const log = {
      id: params[0],
      actor_id: params[1],
      action: params[2],
      target_user_id: params[3],
      details: params[4],
      created_at: new Date().toISOString()
    };
    memoryDb.audit_logs.unshift(log);
    return { rows: [log] };
  }

  // INSERT INTO mentor_approvals / DELETE
  if (normalized.startsWith('insert into mentor_approvals')) {
    const app = { teacher_id: params[0], mentor_id: params[1], topic_id: params[2] };
    memoryDb.mentor_approvals.push(app);
    return { rows: [app] };
  }
  if (normalized.startsWith('delete from mentor_approvals')) {
    memoryDb.mentor_approvals = memoryDb.mentor_approvals.filter(
      (a) => !(a.mentor_id === params[0] && a.topic_id === params[1])
    );
    return { rows: [] };
  }

  // SELECT progress_records
  if (normalized.startsWith('select') && normalized.includes('from progress_records')) {
    if (normalized.includes('where update_id = $1')) {
      const rec = memoryDb.progress_records.find((r) => r.update_id === params[0]);
      return { rows: rec ? [rec] : [] };
    }
    if (normalized.includes('where learner_id = $1 and entity_id = $2')) {
      const rec = memoryDb.progress_records.find((r) => r.learner_id === params[0] && (r.entity_id === params[1] || r.lesson_id === params[1]));
      return { rows: rec ? [rec] : [] };
    }
    if (normalized.includes('where learner_id = $1')) {
      const recs = memoryDb.progress_records.filter((r) => r.learner_id === params[0]);
      return { rows: recs };
    }
    return { rows: memoryDb.progress_records };
  }

  // INSERT INTO progress_records
  if (normalized.startsWith('insert into progress_records')) {
    const prog = {
      id: params[0],
      update_id: params[1],
      learner_id: params[2],
      entity_id: params[3],
      lesson_id: params[3],
      entity_type: params[4],
      status: params[5],
      last_position: params[6],
      client_time: params[7],
      sync_state: 'synced',
      completed_at: params[7] || new Date().toISOString()
    };
    memoryDb.progress_records.push(prog);
    return { rows: [prog] };
  }

  // UPDATE users (consent)
  if (normalized.startsWith('update users set consent_given')) {
    const user = memoryDb.users.find((u) => u.id === params[2]);
    if (user) {
      user.consent_given = params[0];
      user.consent_at = params[1];
    }
    return { rows: [user || {}] };
  }

  // DELETE for demo purge (NFR-14)
  if (normalized.startsWith('delete from feedbacks') && normalized.includes('where submission_id')) {
    const ids = Array.isArray(params[0]) ? params[0] : [params[0]];
    const before = memoryDb.feedbacks.length;
    memoryDb.feedbacks = memoryDb.feedbacks.filter((f) => !ids.includes(f.submission_id));
    return { rowCount: before - memoryDb.feedbacks.length };
  }
  if (normalized.startsWith('delete from submissions') && normalized.includes('where id')) {
    const ids = Array.isArray(params[0]) ? params[0] : [params[0]];
    const before = memoryDb.submissions.length;
    memoryDb.submissions = memoryDb.submissions.filter((s) => !ids.includes(s.id));
    return { rowCount: before - memoryDb.submissions.length };
  }
  if (normalized.startsWith('delete from progress_records') && normalized.includes('where learner_id')) {
    const ids = Array.isArray(params[0]) ? params[0] : [params[0]];
    const before = memoryDb.progress_records.length;
    memoryDb.progress_records = memoryDb.progress_records.filter((p) => !ids.includes(p.learner_id));
    return { rowCount: before - memoryDb.progress_records.length };
  }

  return { rows: [] };
}

module.exports = {
  query: async (text, params) => {
    if (usePostgres) {
      try {
        return await pool.query(text, params);
      } catch (err) {
        // Fall back to in-memory store if PostgreSQL is unreachable or offline
        usePostgres = false;
        console.warn('[DB Engine] PostgreSQL unreachable. Seamless in-memory fallback activated.');
        return runMemoryQuery(text, params);
      }
    }
    return runMemoryQuery(text, params);
  },
  pool,
  memoryDb
};
