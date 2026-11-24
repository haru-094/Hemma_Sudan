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
    { id: 'usr-mentor-1', name: 'Sarah Ibrahim', email: 'sarah.mentor@hemma.sd', password_hash: '$2b$10$VwQxypFaO.9YJO6.RyY3O.zdGnLGPhJUzmatntE4qNeJAJhesJkPW', role: 'mentor', university: 'University of Khartoum', language: 'en' },
    { id: 'usr-mentor-2', name: 'Omar Farouk', email: 'omar.mentor@hemma.sd', password_hash: '$2b$10$VwQxypFaO.9YJO6.RyY3O.zdGnLGPhJUzmatntE4qNeJAJhesJkPW', role: 'mentor', university: 'Sudan University of Science and Technology', language: 'ar' },
    { id: 'usr-learner-1', name: 'Ahmed Osman', email: 'ahmed.student@hemma.sd', password_hash: '$2b$10$VwQxypFaO.9YJO6.RyY3O.zdGnLGPhJUzmatntE4qNeJAJhesJkPW', role: 'learner', university: 'University of Khartoum', age_confirmed: true, language: 'en' },
    { id: 'usr-learner-2', name: 'Mona Elhassan', email: 'mona.learner@hemma.sd', password_hash: '$2b$10$VwQxypFaO.9YJO6.RyY3O.zdGnLGPhJUzmatntE4qNeJAJhesJkPW', role: 'learner', university: 'Al-Neelain University', age_confirmed: true, language: 'en' }
  ],
  topics: [
    { id: 'topic-0', title_en: '0. Developer Setup: VS Code, Git & GitHub', title_ar: '٠. تهيئة بيئة المطور: محرر VS Code، أداة Git، ومستودعات GitHub', description_en: 'Setting up your local code editor (VS Code), compiler/interpreter, Git version control, and public GitHub repository workflow.', description_ar: 'تهيئة محرر الأكواد (VS Code)، بيئة بايثون و C++ وجافا، نظام التحكم بالنسخ Git، والعمل مع مستودعات GitHub العامة.', display_order: 0 },
    { id: 'topic-1', title_en: '1. Fundamentals & Input Processing', title_ar: '١. الأساسيات ومعالجة المدخلات', description_en: 'Variables, primitive data types, arithmetic operators, string formatting, and terminal input across Python, C++, and Java.', description_ar: 'المتغيرات، أنواع البيانات الأساسية، العمليات الحسابية، تنسيق النصوص، ومدخلات الطرفية عبر بايثون، C++، وجافا.', display_order: 1 },
    { id: 'topic-2', title_en: '2. Control Flow, Conditionals & Loops', title_ar: '٢. تدفق التحكم، الشروط، والتكرار (الحلقات)', description_en: 'Making decisions with conditionals and automating repetitions with while and for loops in Python, C++, and Java.', description_ar: 'اتخاذ القرارات عبر الجمل الشرطية وتكرار العمليات عبر حلقات for و while في بايثون، C++، وجافا.', display_order: 2 },
    { id: 'topic-3', title_en: '3. Functions, Modular Design & Scope', title_ar: '٣. الدوال، التصميم المعياري، ونطاق المتغيرات', description_en: 'Decomposing problems into reusable functions, parameter passing, return values, and modular architecture.', description_ar: 'تقسيم المشاكل البرمجية إلى دوال قابلة لإعادة الاستخدام، تمرير المعاملات، وإرجاع القيم عبر بايثون و C++ وجافا.', display_order: 3 },
    { id: 'topic-5', title_en: '4. Object-Oriented Programming (OOP) & Architecture', title_ar: '٤. البرمجة كائنية التوجه (OOP) وهندسة البرمجيات', description_en: 'Classes, objects, encapsulation, inheritance, polymorphism, and abstract interface contracts across Python, C++, and Java.', description_ar: 'الأصناف، الكائنات، تغليف البيانات، الوراثة، تعدد الأشكال، وتصميم الواجهات المجردة عبر بايثون و C++ وجافا.', display_order: 4 },
    { id: 'topic-6', title_en: '5. Data Structures, File I/O & Persistent Storage', title_ar: '٥. هياكل البيانات، التعامل مع الملفات والتخزين الدائم', description_en: 'Hash maps, sets, dynamic collections, file streams, JSON serialization, and persistent data storage.', description_ar: 'جداول التجزئة، المجموعات، القوائم الديناميكية، تدفق الملفات، وتسلسل بيانات JSON والتخزين الدائم.', display_order: 5 },
    { id: 'topic-4', title_en: '6. Applied AI, Data Science & Machine Learning (SAIR Community Track)', title_ar: '٦. الذكاء الاصطناعي، علم البيانات وتعلم الآلة (مسار مجتمع SAIR)', description_en: 'NumPy vectorization, Pandas tabular data pipelines, and machine learning model training curated with Sudanese Artificial Intelligence Researchers (SAIR).', description_ar: 'المعالجة الشعاعية عبر NumPy، أنابيب معالجة البيانات بـ Pandas، وتدريب نماذج تعلم الآلة بالتعاون مع الباحثين السودانيين في الذكاء الاصطناعي (SAIR).', display_order: 6 }
  ],
  lessons: [
    { id: 'lesson-0', topic_id: 'topic-0', title_en: 'Local Setup: IDE, Git & Creating Your Public GitHub Repo', title_ar: 'الإعداد المحلي: تثبيت بيئة العمل و Git وإنشاء مستودع GitHub عام', notes_en: 'Setting up your local environment: VS Code, Git, and creating a public GitHub repository.', notes_ar: 'إعداد بيئة التطوير المحلية: محرر VS Code، أداة Git، وإنشاء مستودع عام على GitHub.', code_snippet: 'git init\ngit add .\ngit commit -m "feat: Initial commit"\ngit push -u origin main', display_order: 1, arabic_status: 'approved', is_published: true, version: 1 },
    { id: 'lesson-1', topic_id: 'topic-1', title_en: 'Variables, Arithmetic & User Input', title_ar: 'المتغيرات، العمليات الحسابية، ومدخلات المستخدم', notes_en: 'In this lesson, you will learn how to declare variables and interact with user input.', notes_ar: 'في هذا الدرس، ستتعلم كيفية تعريف المتغيرات والتعامل مع مدخلات المستخدم.', code_snippet: 'user_name = input("Enter your name: ")\nstudy_hours = int(input("Hours? "))\nprint(f"Welcome, {user_name}!")', display_order: 1, arabic_status: 'approved', is_published: true, version: 1 },
    { id: 'lesson-2', topic_id: 'topic-1', title_en: 'Strings, Formatting & Type Conversion', title_ar: 'النصوص، التنسيق، والتحويل بين الأنواع', notes_en: 'Strings are fundamental for representing textual information.', notes_ar: 'تعتبر النصوص ركيزة أساسية لتمثيل البيانات النصية.', code_snippet: 'city = "Khartoum"\ntemp = 38.5\nprint(f"Current temperature in {city} is {temp}°C.")', display_order: 2, arabic_status: 'draft', is_published: true, version: 1 },
    { id: 'lesson-3', topic_id: 'topic-2', title_en: 'Conditional Statements (if, elif, else)', title_ar: 'الجمل الشرطية (if, elif, else)', notes_en: 'Conditionals evaluate boolean conditions to route code execution.', notes_ar: 'تقوم الجمل الشرطية بفحص الشروط المنطقية لتوجيه مسار التنفيذ.', code_snippet: 'score = int(input("Enter exam score: "))\nif score >= 60:\n    print("Pass")', display_order: 1, arabic_status: 'approved', is_published: true, version: 1 },
    { id: 'lesson-4', topic_id: 'topic-2', title_en: 'Loops and Iterations (while & for)', title_ar: 'حلقات التكرار (while و for)', notes_en: 'Loops automate repetitive tasks.', notes_ar: 'تستخدم الحلقات لتكرار العمليات التلقائية.', code_snippet: 'total = 0\nfor i in range(1, 6):\n    total += i\nprint(total)', display_order: 2, arabic_status: 'approved', is_published: true, version: 1 },
    { id: 'lesson-5', topic_id: 'topic-3', title_en: 'Defining Reusable Functions & Scope', title_ar: 'تعريف الدوال القابلة لإعادة الاستخدام والنطاق', notes_en: 'Functions encapsulate reusable logic with parameters and return values.', notes_ar: 'تغلف الدوال الشيفرات القابلة لإعادة الاستخدام مع المعاملات والقيم المرجعة.', code_snippet: 'def calculate_vat(amount: float, rate: float = 0.17) -> float:\n    return amount * rate\nprint(calculate_vat(1000.0))', display_order: 1, arabic_status: 'approved', is_published: true, version: 1 },
    { id: 'lesson-8', topic_id: 'topic-5', title_en: 'Classes, Objects & Encapsulation', title_ar: 'الأصناف، الكائنات، ومبدأ التغليف (OOP)', notes_en: 'Object-Oriented Programming models real-world concepts.', notes_ar: 'البرمجة كائنية التوجه لنمذجة المفاهيم الواقعية.', code_snippet: 'class BankAccount:\n    def __init__(self, owner, balance):\n        self.owner = owner\n        self.balance = balance\naccount = BankAccount("Ahmed", 5000)\nprint(account.owner)', display_order: 1, arabic_status: 'approved', is_published: true, version: 1 },
    { id: 'lesson-9', topic_id: 'topic-5', title_en: 'Inheritance, Polymorphism & Abstract Interfaces', title_ar: 'الوراثة، تعدد الأشكال، والواجهات المجردة', notes_en: 'Inheritance allows classes to inherit fields and methods.', notes_ar: 'تتيح الوراثة اشتقاق الخصائص والطرائق من فئات أساسية.', code_snippet: 'class Account:\n    def fee(self): return 100\nclass StudentAccount(Account):\n    def fee(self): return 0\nprint(StudentAccount().fee())', display_order: 2, arabic_status: 'approved', is_published: true, version: 1 },
    { id: 'lesson-10', topic_id: 'topic-6', title_en: 'Data Collections, File Streams & JSON Persistence', title_ar: 'هياكل البيانات، تدفق الملفات، وتسلسل بيانات JSON', notes_en: 'Storing data in collections and persisting to files.', notes_ar: 'تخزين البيانات في الهياكل البرمجية وحفظها في ملفات.', code_snippet: 'import json\ndata = {"ahmed": 92}\nwith open("grades.json", "w") as f: json.dump(data, f)', display_order: 1, arabic_status: 'approved', is_published: true, version: 1 },
    { id: 'lesson-6', topic_id: 'topic-4', title_en: 'NumPy Vectorization & High-Performance Data Processing', title_ar: 'المعالجة الشعاعية والبيانات عالية الأداء عبر NumPy (مسار SAIR)', notes_en: 'Vector operations and tensor manipulation curated with SAIR.', notes_ar: 'العمليات الشعاعية ومعالجة المصفوفات بالتعاون مع SAIR.', code_snippet: 'import numpy as np\nrainfall = np.array([12.5, 34.0, 8.2])\nprint(f"Mean: {np.mean(rainfall)}")', display_order: 1, arabic_status: 'approved', is_published: true, version: 1 },
    { id: 'lesson-7', topic_id: 'topic-4', title_en: 'Pandas & Machine Learning Foundations (SAIR Research Track)', title_ar: 'تحليل البيانات وتعلم الآلة التأسيسي (مسار بحوث SAIR)', notes_en: 'Tabular data engineering and machine learning model training.', notes_ar: 'هندسة البيانات الجدولية ونماذج تعلم الآلة.', code_snippet: 'import pandas as pd\ndf = pd.DataFrame({"temp": [28, 43], "status": [1, 0]})\nprint(df.describe())', display_order: 2, arabic_status: 'approved', is_published: true, version: 1 },
    // Backward-compatibility aliases
    { id: 'lesson-1-1', topic_id: 'topic-1', title_en: 'Variables, Expressions & Print Output', title_ar: 'المتغيرات، التعبيرات الحسابية ودالة الطباعة', notes_en: 'Understanding how variables hold values in memory.', notes_ar: 'فهم كيفية تخزين القيم في الذاكرة.', code_snippet: 'rate = 2600.0\nprint(f"USD to SDG: {rate}")', recording_link: 'https://youtu.be/mock-lesson-1', display_order: 1, arabic_status: 'approved', is_published: true, version: 1 },
    { id: 'lesson-1-2', topic_id: 'topic-1', title_en: 'Console Input & Type Conversions', title_ar: 'مدخلات الطرفية وتحويل أنواع البيانات', notes_en: 'Interactive programs using input().', notes_ar: 'البرامج التفاعلية باستخدام input().', code_snippet: 'name = input("Enter name: ")\nprint(f"Marhaban, {name}!")', recording_link: 'https://youtu.be/mock-lesson-2', display_order: 2, arabic_status: 'approved', is_published: true, version: 1 }
  ],
  mentor_approvals: [
    { teacher_id: 'usr-teacher-1', mentor_id: 'usr-mentor-1', topic_id: 'topic-1' },
    { teacher_id: 'usr-teacher-1', mentor_id: 'usr-mentor-1', topic_id: 'topic-2' },
    { teacher_id: 'usr-teacher-1', mentor_id: 'usr-mentor-2', topic_id: 'topic-2' },
    { teacher_id: 'usr-teacher-1', mentor_id: 'usr-mentor-2', topic_id: 'topic-3' }
  ],
  submissions: [],
  feedbacks: [],
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
    if (normalized.includes('where lower(email) = lower($1)')) {
      const u = memoryDb.users.find((user) => user.email.toLowerCase() === (params[0] || '').toLowerCase());
      return { rows: u ? [u] : [] };
    }
    if (normalized.includes('where email = $1')) {
      const u = memoryDb.users.find((user) => user.email === params[0]);
      return { rows: u ? [u] : [] };
    }
    if (normalized.includes('where id = $1')) {
      const u = memoryDb.users.find((user) => user.id === params[0]);
      return { rows: u ? [u] : [] };
    }
    if (normalized.includes("role = 'teacher'")) {
      const teachers = memoryDb.users.filter((user) => user.role === 'teacher');
      return { rows: teachers };
    }
    if (normalized.includes("role = 'mentor'")) {
      const mentors = memoryDb.users.filter((user) => user.role === 'mentor');
      return { rows: mentors };
    }
    if (normalized.includes("where role = $1")) {
      const found = memoryDb.users.filter((user) => user.role === params[0]);
      return { rows: found };
    }
    return { rows: memoryDb.users };
  }

  // SELECT topics
  if (normalized.startsWith('select') && normalized.includes('from topics')) {
    return { rows: memoryDb.topics };
  }

  // SELECT lessons
  if (normalized.startsWith('select') && normalized.includes('from lessons')) {
    if (normalized.includes('max(display_order)') || normalized.includes('next_order')) {
      const matching = memoryDb.lessons.filter((l) => !params || params.length === 0 || l.topic_id === params[0]);
      const maxOrder = matching.reduce((max, l) => Math.max(max, l.display_order || 0), 0);
      return { rows: [{ next_order: maxOrder + 1 }] };
    }
    if (normalized.includes('where l.id = $1') || normalized.includes('where id = $1')) {
      const l = memoryDb.lessons.find((less) => less.id === params[0]);
      if (l) {
        const top = memoryDb.topics.find((t) => t.id === l.topic_id);
        return { rows: [{ ...l, topic_title_en: top?.title_en, topic_title_ar: top?.title_ar }] };
      }
      return { rows: [] };
    }
    if (normalized.includes('where topic_id = $1')) {
      const ls = memoryDb.lessons.filter((less) => less.topic_id === params[0]);
      return { rows: ls };
    }
    return { rows: memoryDb.lessons.filter((l) => l.is_published !== false) };
  }

  // INSERT INTO lessons
  if (normalized.startsWith('insert into lessons')) {
    const newLesson = {
      id: params[0],
      topic_id: params[1],
      display_order: params[2] || 1,
      title_en: params[3],
      title_ar: params[4] || params[3],
      notes_en: params[5],
      notes_ar: params[6] || params[5],
      code_snippet: params[7],
      recording_link: params[8] || null,
      arabic_status: params[9] || 'draft',
      is_published: true,
      version: 1,
      created_at: new Date().toISOString()
    };
    memoryDb.lessons.push(newLesson);
    return { rows: [newLesson] };
  }

  // UPDATE lessons set arabic_status
  if (normalized.startsWith('update lessons set arabic_status')) {
    const l = memoryDb.lessons.find((less) => less.id === params[1]);
    if (l) l.arabic_status = params[0];
    return { rows: [l || {}] };
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

  // DELETE for demo purge
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

  // INSERT INTO users
  if (normalized.startsWith('insert into users')) {
    let newUser;
    if (normalized.includes("'learner'")) {
      // Registration route insert
      newUser = {
        id: params[0],
        name: params[1],
        email: params[2],
        password_hash: params[3],
        role: 'learner',
        language: 'en',
        university: params[4] || null,
        age_confirmed: Boolean(params[5]),
        created_at: new Date().toISOString()
      };
    } else if (normalized.includes("'teacher'")) {
      // Teacher seeding insert
      newUser = {
        id: params[0],
        name: params[1],
        email: params[2],
        password_hash: params[3],
        role: 'teacher',
        language: 'en',
        course_title: params[4] || 'Introduction to Computer Science & Python',
        created_at: new Date().toISOString()
      };
    } else {
      // General/seed user insert
      newUser = {
        id: params[0],
        name: params[1],
        email: params[2],
        password_hash: params[3],
        role: params[4] || 'learner',
        language: params[5] || 'en',
        university: params[6] || null,
        age_confirmed: Boolean(params[7]),
        course_title: params[8] || (params[4] === 'teacher' ? 'Introduction to Computer Science & Python' : null),
        created_at: new Date().toISOString()
      };
    }
    const existingIdx = memoryDb.users.findIndex(
      (u) => u.id === newUser.id || u.email.toLowerCase() === newUser.email.toLowerCase()
    );
    if (existingIdx >= 0) {
      memoryDb.users[existingIdx] = { ...memoryDb.users[existingIdx], ...newUser };
      return { rows: [memoryDb.users[existingIdx]] };
    }
    memoryDb.users.push(newUser);
    return { rows: [newUser] };
  }

  return { rows: [] };
}

const db = {
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

async function seedTeacherAccount() {
  const email = process.env.TEACHER_EMAIL || 'teacher@hemma.sd';
  const password = process.env.TEACHER_PASSWORD || 'TeacherSecurePass2026!';
  const name = process.env.TEACHER_NAME || 'Dr. Tariq Ahmed';

  try {
    const bcrypt = require('bcryptjs');
    const passwordHash = bcrypt.hashSync(password, 10);
    const teacherId = 'usr-teacher-1';

    const res = await db.query("SELECT id, password_hash FROM users WHERE role = 'teacher' LIMIT 1");
    if (res.rows && res.rows.length > 0) {
      const existingTeacher = res.rows[0];
      // If the teacher has an outdated mock_hash or missing hash, upgrade to bcrypt hash
      if (!existingTeacher.password_hash || existingTeacher.password_hash.startsWith('mock_hash') || existingTeacher.password_hash === 'mock_hash') {
        await db.query("UPDATE users SET password_hash = $1 WHERE id = $2", [passwordHash, existingTeacher.id]);
        console.log(`[Teacher Seed] Upgraded existing teacher account to bcrypt hash.`);
      }
      return false; // Teacher already exists
    }

    await db.query(
      `INSERT INTO users (id, name, email, password_hash, role, language, course_title)
       VALUES ($1, $2, $3, $4, 'teacher', 'en', $5)
       ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, password_hash = EXCLUDED.password_hash`,
      [teacherId, name.trim(), email.trim().toLowerCase(), passwordHash, 'Introduction to Computer Science & Python']
    );

    console.log(`[Teacher Seed] Teacher account seeded from environment variables (${email.trim()}).`);
    return true;
  } catch (err) {
    console.warn('[Teacher Seed] Warning during teacher seeding:', err.message);
    return false;
  }
}

db.seedTeacherAccount = seedTeacherAccount;

module.exports = db;
