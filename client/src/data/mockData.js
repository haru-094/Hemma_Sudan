export const TRACKS = [
  {
    id: 'python',
    titleEn: 'Python & AI Engineering (SAIR Track)',
    titleAr: 'مسار بايثون والذكاء الاصطناعي (بالشراكة مع مجتمع SAIR)',
    shortTitleEn: 'Python & AI',
    shortTitleAr: 'بايثون والذكاء الاصطناعي',
    descriptionEn: 'Master Python from fundamentals to advanced AI, NumPy vectorization, Pandas tabular workflows, and machine learning models.',
    descriptionAr: 'تعلم بايثون من الأساسيات إلى الذكاء الاصطناعي، الحساب الشعاعي بـ NumPy، تحليل البيانات بـ Pandas، ونماذج تعلم الآلة.',
    icon: '🐍',
    syntax: 'python3',
    badgeEn: 'SAIR AI Focus',
    badgeAr: 'مسار مجتمع SAIR',
    isSairTrack: true,
  },
  {
    id: 'cpp',
    titleEn: 'C++ & High-Performance Systems',
    titleAr: 'مسار سي++ والأنظمة عالية الأداء (C++)',
    shortTitleEn: 'C++ Systems',
    shortTitleAr: 'سي++ والأنظمة',
    descriptionEn: 'High-performance computing, memory management, pointer safety, SIMD vectorization, and cache-conscious algorithms.',
    descriptionAr: 'الحوسبة عالية الأداء، إدارة الذاكرة، المؤشرات الآمنة، تسريع SIMD، والخوارزميات المحسنة للذاكرة المخبئية.',
    icon: '⚡',
    syntax: 'cpp',
    badgeEn: 'Systems & HPC',
    badgeAr: 'أنظمة وأداء فائق',
    isSairTrack: false,
  },
  {
    id: 'java',
    titleEn: 'Java & Enterprise Architecture',
    titleAr: 'مسار جافا وهندسة البرمجيات (Java)',
    shortTitleEn: 'Java Enterprise',
    shortTitleAr: 'جافا والمؤسسات',
    descriptionEn: 'Object-oriented programming, modern Java records, functional streams API, and scalable backend design.',
    descriptionAr: 'البرمجة كائنية التوجه، سجلات جافا الحديثة، واجهة التدفق Streams API، وتصميم الأنظمة القابلة للتوسع.',
    icon: '☕',
    syntax: 'java',
    badgeEn: 'Enterprise & Backend',
    badgeAr: 'هندسة البرمجيات',
    isSairTrack: false,
  },
];

export const TOPICS = [
  {
    id: 'topic-0',
    displayOrder: 0,
    titleEn: '0. Developer Setup: VS Code, Git & GitHub',
    titleAr: '٠. تهيئة بيئة المطور: محرر VS Code، أداة Git، ومستودعات GitHub',
    descriptionEn: 'Setting up your local code editor (VS Code), compiler/interpreter, Git version control, and public GitHub repository workflow.',
    descriptionAr: 'تهيئة محرر الأكواد (VS Code)، بيئة بايثون و C++ وجافا، نظام التحكم بالنسخ Git، والعمل مع مستودعات GitHub العامة.',
    languages: ['python', 'cpp', 'java'],
    levels: ['basic'],
    lessons: ['lesson-0'],
    session: {
      type: 'recorded',
      platform: 'YouTube',
      url: 'https://youtube.com/watch?v=demo-hemma-setup-guide',
      titleEn: 'Module 0 Workshop: Local Tooling & GitHub Workflow',
      titleAr: 'ورشة الوحدة صفر: تثبيت الأدوات المحلية والعمل مع GitHub',
      duration: '42m',
      instructor: 'Dr. Al-Amin',
    },
    quiz: {
      id: 'quiz-0',
      titleEn: 'Module 0 Tooling Check (Self-Assessment)',
      titleAr: 'اختبار المعرفة لأدوات المطور للوحدة صفر',
      questions: [
        {
          id: 'q0-1',
          questionEn: 'Which command sets your global username for Git commits?',
          questionAr: 'ما هو الأمر البرمجي في Git لضبط اسم المستخدم الخاص بك؟',
          codeSnippet: 'git config --global user.name "Your Name"',
          optionsEn: ['git config --global user.name "Your Name"', 'git init user "Your Name"', 'git set name "Your Name"', 'git commit -name "Your Name"'],
          optionsAr: ['git config --global user.name "Your Name"', 'git init user "Your Name"', 'git set name "Your Name"', 'git commit -name "Your Name"'],
          correctIndex: 0,
          explanationEn: 'The git config command records your authorship metadata for all repositories on your computer.',
          explanationAr: 'يقوم الأمر git config بتسجيل هويتك البرمجية لجميع المستودعات على جهازك.',
        },
        {
          id: 'q0-2',
          questionEn: 'Why must project submission repositories on GitHub be configured as "Public"?',
          questionAr: 'لماذا يجب إنشاء مستودع المشروع على GitHub كـ "عام" (Public)؟',
          optionsEn: [
            'So mentors and instructors can inspect your code without authentication roadblocks.',
            'Because Git does not allow private repositories.',
            'To make the computer run faster.',
            'Private repositories cannot contain code files.',
          ],
          optionsAr: [
            'ليتمكن المرشدون وأستاذ المساق من فحص الكود وتصحيحه بدون حواجز صلاحيات.',
            'لأن Git لا يسمح بالمستودعات الخاصة.',
            'لتسريع أداء الحاسوب.',
            'المستودعات الخاصة لا يمكنها تخزين ملفات برمجية.',
          ],
          correctIndex: 0,
          explanationEn: 'Submissions are validated against public URLs accessible by mentors.',
          explanationAr: 'يجب أن يكون الرابط عاماً للتحقق من وصول المرشدين إليه.',
        },
      ],
    },
    assignment: {
      id: 'assign-0',
      titleEn: 'Module 0 Project: Hello Hemma Public GitHub Repository',
      titleAr: 'مشروع الوحدة صفر: إنشاء مستودع GitHub عام ورفع أول كود برمجياً',
      promptEn: `Create and publish your first public GitHub repository:
1. Initialize a local directory with Git: git init.
2. Create a hello script in your chosen language (hello.py, main.cpp, or Main.java).
3. Create a README.md explaining your student name and university affiliation.
4. Push to a new public repository on GitHub.com and submit the link below.`,
      promptAr: `أنشئ أول مستودع GitHub عام لك:
1. قم بتهيئة مجلد محلي باستخدام git init.
2. أنشئ برنامج ترحيبي بسيط باللغة التي اخترتها (hello.py أو main.cpp أو Main.java).
3. اكتب ملف README.md يحتوي على اسمك والجامعة.
4. ارفع المشروع إلى مستودع عام على GitHub.com وقدم الرابط للمراجعة.`,
    },
  },
  {
    id: 'topic-1',
    displayOrder: 1,
    titleEn: '1. Fundamentals & Input Processing',
    titleAr: '١. الأساسيات ومعالجة المدخلات',
    descriptionEn: 'Variables, primitive data types, arithmetic operators, string formatting, and terminal input across Python, C++, and Java.',
    descriptionAr: 'المتغيرات، أنواع البيانات الأساسية، العمليات الحسابية، تنسيق النصوص، ومدخلات الطرفية عبر بايثون، C++، وجافا.',
    languages: ['python', 'cpp', 'java'],
    levels: ['basic', 'advanced'],
    lessons: ['lesson-1', 'lesson-2'],
    session: {
      type: 'recorded',
      platform: 'Google Drive',
      url: 'https://drive.google.com/file/d/1demo-hemma-fundamentals-lecture/view',
      titleEn: 'Module 1 Recorded Lecture: Variables, Memory & Terminal I/O',
      titleAr: 'تسجيل محاضرة الوحدة الأولى: المتغيرات والذاكرة ومدخلات الطرفية',
      duration: '1h 15m',
      instructor: 'Dr. Al-Amin',
    },
    quiz: {
      id: 'quiz-1',
      titleEn: 'Module 1 Knowledge Check (Self-Assessment)',
      titleAr: 'اختبار تقييم المفاهيم للوحدة الأولى',
      questions: [
        {
          id: 'q1-1',
          questionEn: 'What is the output of the following Python snippet?\nx = 10\ny = 3\nprint(x // y)',
          questionAr: 'ما هو ناتج تنفيذ الشيفرة البرمجية التالية في بايثون؟\nx = 10\ny = 3\nprint(x // y)',
          codeSnippet: 'x = 10\ny = 3\nprint(x // y)',
          optionsEn: ['3.33', '3', '3.0', '1'],
          optionsAr: ['3.33', '3', '3.0', '1'],
          correctIndex: 1,
          explanationEn: 'The // operator performs integer floor division in Python, returning 3 without the decimal remainder. In C++ and Java, integer division between two ints behaves similarly.',
          explanationAr: 'المعامل // يقوم بالقسمة الصحيحة (Floor Division) في بايثون، فيعيد الناتج 3 مهملاً الكسور. وفي C++ وجافا، قسمة عددين صحيحين تنتج نفس النتيجة.',
        },
        {
          id: 'q1-2',
          questionEn: 'How does type declaration differ between Python and C++/Java?',
          questionAr: 'كيف يختلف تعريف أنواع البيانات بين بايثون ولغتي C++ وجافا؟',
          optionsEn: [
            'Python is dynamically typed; C++ and Java are statically typed.',
            'C++ and Java do not require type declarations.',
            'Python requires the int keyword before all variables.',
            'There is no difference in type declaration.',
          ],
          optionsAr: [
            'بايثون لغة ديناميكية النوع، بينما C++ وجافا لغتان ساكنتا النوع (Statically Typed).',
            'C++ وجافا لا تتطلبان تحديد نوع البيانات مسبقاً.',
            'بايثون تشترط كتابة الكلمة int قبل كل متغير.',
            'لا يوجد أي فرق في طريقة تعريف الأنواع.',
          ],
          correctIndex: 0,
          explanationEn: 'In Python, variables receive their types dynamically at runtime. In C++ and Java, you must declare types (e.g., int, double, String) at compile time.',
          explanationAr: 'في بايثون، يُحدد نوع المتغير ديناميكياً أثناء التشغيل. أما في C++ وجافا، فيجب تحديد نوع المتغير صراحة (مثل int, double, String) قبل الترجمة.',
        },
        {
          id: 'q1-3',
          questionEn: 'Which is the valid syntax for a Python f-string?',
          questionAr: 'أي من الصيغ التالية صحيحة لكتابة f-string في بايثون؟',
          optionsEn: [
            'f"Hello {name}"',
            '"Hello %name"',
            'format("Hello", name)',
            '$"Hello {name}"',
          ],
          optionsAr: [
            'f"Hello {name}"',
            '"Hello %name"',
            'format("Hello", name)',
            '$"Hello {name}"',
          ],
          correctIndex: 0,
          explanationEn: 'Prefixing string literals with f (or F) allows inline variable interpolation inside curly braces {}.',
          explanationAr: 'وضع حرف f قبل النص يسمح بدمج المتغيرات مباشرة داخل الأقواس المعقوفة {}.',
        },
      ],
    },
    assignment: {
      id: 'assign-1',
      titleEn: 'Module 1 Project: Student Expense & Currency Calculator',
      titleAr: 'مشروع الوحدة الأولى: حاسبة مصروفات الطالب وتحويل العملات',
      promptEn: `Develop a command-line application (in Python, C++, or Java) that helps university students track monthly expenses and currency conversions:
1. Prompt for student name, university, and monthly budget in SDG (Sudanese Pounds).
2. Capture estimated costs for transportation, study materials, and internet cards.
3. Compute total expenses, remaining balance, and average daily allowance.
4. Output a cleanly formatted summary with formatted currency values.
5. Push your code to a public GitHub repository with a README.md explaining how to run it.`,
      promptAr: `قم ببناء برنامج يعمل عبر الطرفية (بلغة بايثون، C++، أو جافا) لمساعدة طلاب الجامعات على إدارة مصاريفهم الشهرية:
1. اطلب من المستخدم إدخال اسمه، اسم جامعته، والميزانية الشهرية بالجنيه السوداني.
2. استقبل تكاليف المواصلات، الكتب والمراجع، وباقات الإنترنت.
3. احسب إجمالي المصروفات، الرصيد المتبقي، ومتوسط الإنفاق اليومي.
4. اعرض ملخصاً منسقاً للنتائج.
5. ارفع المشروع إلى مستودع GitHub عام مع ملف README.md يشرح طريقة التشغيل.`,
    },
  },
  {
    id: 'topic-2',
    displayOrder: 2,
    titleEn: '2. Control Flow, Conditionals & Loops',
    titleAr: '٢. تدفق التحكم، الشروط، والتكرار (الحلقات)',
    descriptionEn: 'Making decisions with conditionals and automating repetitions with while and for loops in Python, C++, and Java.',
    descriptionAr: 'اتخاذ القرارات عبر الجمل الشرطية وتكرار العمليات عبر حلقات for و while في بايثون، C++، وجافا.',
    languages: ['python', 'cpp', 'java'],
    levels: ['basic', 'advanced'],
    lessons: ['lesson-3', 'lesson-4'],
    session: {
      type: 'live',
      platform: 'Google Meet',
      url: 'https://meet.google.com/xyz-hemma-live',
      titleEn: 'Module 2 LIVE Workshop: Control Flow & Algorithmic Loops',
      titleAr: 'بث مباشر للوحدة الثانية: الشروط والتكرار وحل المسائل البرمجية',
      duration: 'Live Session in Progress',
      instructor: 'Dr. Al-Amin',
    },
    quiz: {
      id: 'quiz-2',
      titleEn: 'Module 2 Knowledge Check (Self-Assessment)',
      titleAr: 'اختبار تقييم المفاهيم للوحدة الثانية',
      questions: [
        {
          id: 'q2-1',
          questionEn: 'How many times will this loop execute?\nfor i in range(2, 8, 2):',
          questionAr: 'كم عدد المرات التي ستتكرر فيها هذه الحلقة؟\nfor i in range(2, 8, 2):',
          codeSnippet: 'for i in range(2, 8, 2):\n    print(i)',
          optionsEn: ['3 times (2, 4, 6)', '4 times (2, 4, 6, 8)', '6 times', '2 times'],
          optionsAr: ['٣ مرات (2, 4, 6)', '٤ مرات (2, 4, 6, 8)', '٦ مرات', 'مرتان'],
          correctIndex: 0,
          explanationEn: 'range(2, 8, 2) starts at 2, increments by 2, and stops before 8, yielding 2, 4, 6 (equivalent to for(int i=2; i<8; i+=2) in C++ and Java).',
          explanationAr: 'الدالة range(2, 8, 2) تبدأ من 2 وتقفز بقيمة 2 وتتوقف قبل 8، فتنتج القيم 2 و 4 و 6 (وتكافئ تماماً حلقة for(int i=2; i<8; i+=2) في C++ وجافا).',
        },
        {
          id: 'q2-2',
          questionEn: 'Which keyword immediately exits a loop regardless of the condition in Python, C++, and Java?',
          questionAr: 'ما هي الكلمة المفتاحية المشتركة التي تنهي تنفيذ الحلقة فوراً في بايثون و C++ وجافا؟',
          optionsEn: ['break', 'continue', 'pass / skip', 'return'],
          optionsAr: ['break', 'continue', 'pass / skip', 'return'],
          correctIndex: 0,
          explanationEn: 'break immediately terminates the nearest enclosing loop across all three languages.',
          explanationAr: 'الأمر break يقطع الحلقة ويوقف تكرارها فوراً في اللغات الثلاث.',
        },
      ],
    },
    assignment: {
      id: 'assign-2',
      titleEn: 'Module 2 Project: Academic Grading & Attendance System',
      titleAr: 'مشروع الوحدة الثانية: نظام احتساب الدرجات ونسب الحضور الأكاديمي',
      promptEn: `Create an interactive terminal program (Python, C++, or Java) for grading students:
1. Accept grades for multiple assessments and enforce validation (scores between 0 and 100).
2. Determine grade classification (Distinction, Merit, Pass, Fail) with conditional logic.
3. Allow the teacher to repeatedly enter records until they type 'quit' using a loop.
4. Output class summary: Highest score, lowest score, and class average.
5. Push to GitHub and provide repository link with code explanation.`,
      promptAr: `أنشئ برنامجاً تفاعلياً (بايثون، C++، أو جافا) لإدارة درجات الطلاب وحساب التقديرات:
1. استقبل درجات الاختبارات مع التحقق من صحتها (بين 0 و 100).
2. حدد التقدير (ممتاز، جيد جداً، ناجح، راسب) عبر الجمل الشرطية.
3. اسمح للأستاذ بإدخال عدة طلاب متتالين حتى يكتب 'quit' عبر حلقة تكرار.
4. اعرض إحصائية الفصل: أعلى درجة، أدنى درجة، ومتوسط درجات الطلاب.
5. ارفع الحل إلى GitHub مع شرح الكود.`,
    },
  },
  {
    id: 'topic-3',
    displayOrder: 3,
    titleEn: '3. Functions, Modular Design & Scope',
    titleAr: '٣. الدوال، التصميم المعياري، ونطاق المتغيرات',
    descriptionEn: 'Decomposing problems into reusable functions, parameter passing, return values, and modular architecture.',
    descriptionAr: 'تقسيم المشاكل البرمجية إلى دوال قابلة لإعادة الاستخدام، تمرير المعاملات، وإرجاع القيم عبر بايثون و C++ وجافا.',
    languages: ['python', 'cpp', 'java'],
    levels: ['basic', 'advanced'],
    lessons: ['lesson-5'],
    session: {
      type: 'recorded',
      platform: 'YouTube',
      url: 'https://youtube.com/watch?v=demo-hemma-functions',
      titleEn: 'Module 3 Recorded Class: Modular Architecture & Scope',
      titleAr: 'تسجيل محاضرة الوحدة الثالثة: الدوال والتصميم المعياري',
      duration: '58m',
      instructor: 'Dr. Al-Amin',
    },
    quiz: {
      id: 'quiz-3',
      titleEn: 'Module 3 Knowledge Check (Self-Assessment)',
      titleAr: 'اختبار تقييم المفاهيم للوحدة الثالثة',
      questions: [
        {
          id: 'q3-1',
          questionEn: 'What does a function return in Python when no return statement is executed?',
          questionAr: 'ماذا تعيد دالة بايثون إذا لم تحتوي على جملة return صريحة؟',
          optionsEn: ['None', '0', 'void', 'False'],
          optionsAr: ['None', '0', 'void', 'False'],
          correctIndex: 0,
          explanationEn: 'In Python, functions without an explicit return return None. In C++ and Java, functions with a non-void return type require an explicit return of that type.',
          explanationAr: 'في بايثون تعيد الدالة بدون return صريحة الكائن None. أما في C++ وجافا، فالدوال غير محددة النوع كـ void تشترط إرجاع قيمة متوافقة مع نوعها.',
        },
      ],
    },
    assignment: {
      id: 'assign-3',
      titleEn: 'Module 3 Project: Modular Inventory & Supply Tracker',
      titleAr: 'مشروع الوحدة الثالثة: نظام إدارة المخزون المعياري بالدوال',
      promptEn: `Build a modular inventory management program (Python, C++, or Java):
1. Write separate functions/methods for adding items, updating stock, and generating inventory reports.
2. Implement robust input validation functions.
3. Document each function with clear docstrings / comments.
4. Submit repository link with documentation.`,
      promptAr: `أنشئ نظاماً معيارياً لإدارة المخزون باستخدام الدوال المنفصلة (بايثون أو C++ أو جافا) مع توثيق الدوال ورفع المشروع إلى GitHub.`,
    },
  },
  {
    id: 'topic-5',
    displayOrder: 4,
    titleEn: '4. Object-Oriented Programming (OOP) & Architecture',
    titleAr: '٤. البرمجة كائنية التوجه (OOP) وهندسة البرمجيات',
    descriptionEn: 'Classes, objects, encapsulation, inheritance, polymorphism, and abstract interface contracts across Python, C++, and Java.',
    descriptionAr: 'الأصناف، الكائنات، تغليف البيانات، الوراثة، تعدد الأشكال، وتصميم الواجهات المجردة عبر بايثون و C++ وجافا.',
    languages: ['python', 'cpp', 'java'],
    levels: ['basic', 'advanced'],
    lessons: ['lesson-8', 'lesson-9'],
    session: {
      type: 'recorded',
      platform: 'Zoom Archive',
      url: 'https://zoom.us/rec/share/demo-hemma-oop',
      titleEn: 'Module 4 Recorded Session: Object-Oriented Design & Encapsulation',
      titleAr: 'تسجيل محاضرة الوحدة الرابعة: البرمجة كائنية التوجه والتغليف',
      duration: '1h 25m',
      instructor: 'Dr. Al-Amin',
    },
    quiz: {
      id: 'quiz-5',
      titleEn: 'Module 4 Knowledge Check: OOP, Classes & Interfaces',
      titleAr: 'اختبار تقييم المفاهيم: البرمجة الكائنية والأصناف والواجهات',
      questions: [
        {
          id: 'q5-1',
          questionEn: 'What is the primary benefit of Encapsulation in Object-Oriented Design?',
          questionAr: 'ما هي الفائدة الجوهرية لمبدأ تغليف البيانات (Encapsulation) في التصميم الكائني؟',
          optionsEn: [
            'Hiding internal object state and exposing operations through well-defined public methods/properties.',
            'Executing program code without needing a CPU.',
            'Automatically translating code into binary machine instructions.',
            'Allowing any function to directly modify private variables without restriction.',
          ],
          optionsAr: [
            'إخفاء الحالة الداخلية للكائن والتحكم في تعديل البيانات عبر طرائق وخصائص عامة ومحمية.',
            'تشغيل البرنامج دون الحاجة إلى معالج مركزي.',
            'ترجمة الشيفرة تلقائياً إلى لغة الآلة الثنائية.',
            'السماح لأي دالة بتعديل المتغيرات الخاصة بحرية تامة دون أي قيود.',
          ],
          correctIndex: 0,
          explanationEn: 'Encapsulation bundles data with the methods that operate on it and restricts direct external access to internal state, enforcing data validity.',
          explanationAr: 'يقوم التغليف بدمج البيانات مع الدوال التي تتعامل معها ويمنع الوصول المباشر للحالة الداخلية من الخارج، مما يحمي صحة وتناسق البيانات.',
        },
        {
          id: 'q5-2',
          questionEn: 'In polymorphism, what allows a subclass method to be executed dynamically via a base class reference/pointer?',
          questionAr: 'في تعدد الأشكال (Polymorphism)، ما الذي يسمح بتنفيذ دالة الفئة المشتقة ديناميكياً عبر مؤشر أو مرجع من الفئة الأساسية؟',
          optionsEn: [
            'Dynamic dispatch (virtual methods and vtables in C++/Java/Python).',
            'Restarting the operating system.',
            'Hardcoding memory addresses at compile time.',
            'Eliminating all classes from memory.',
          ],
          optionsAr: [
            'الإرسال الديناميكي (Dynamic Dispatch عبر الدوال الافتراضية وجداول vtable).',
            'إعادة تشغيل نظام التشغيل.',
            'تثبيت عناوين الذاكرة بشكل صلب أثناء الترجمة.',
            'حذف كافة الأصناف من الذاكرة.',
          ],
          correctIndex: 0,
          explanationEn: 'Dynamic dispatch inspects the actual runtime type of the object and invokes the overridden implementation at runtime.',
          explanationAr: 'يقوم الإرسال الديناميكي (Dynamic Dispatch) بفحص النوع الفعلي للكائن أثناء التشغيل واستدعاء النسخة المعاد كتابتها (Overridden Method) المناسبة.',
        },
      ],
    },
    assignment: {
      id: 'assign-5',
      titleEn: 'Module 4 Project: Banking & Telephony Service System',
      titleAr: 'مشروع الوحدة الرابعة: نظام الحسابات المصرفية وخدمات الاتصالات الكائني',
      promptEn: `Develop an Object-Oriented system (Python, C++, or Java) for banking or telecom subscription management:
1. Design a base class Account / Subscription with encapsulated private balance / quota fields.
2. Implement derived classes (e.g. SavingsAccount with interest, or StudentTelecomPlan with data bundles).
3. Utilize inheritance and method overriding to apply distinct transaction fees or bundle rules.
4. Enforce input validation and raise/throw custom exceptions on overdraft or invalid operations.
5. Push your clean object-oriented architecture to GitHub with architectural class diagram documentation.`,
      promptAr: `أنشئ نظاماً برمجياً كائني التوجه (بايثون، C++، أو جافا) لإدارة الحسابات المصرفية أو اشتراكات الاتصالات:
1. صمم فئة أساسية Account بتغليف محكم للرصيد والمبالغ الخاصة.
2. أنشئ فئات مشتقة (مثل SavingsAccount بحساب الأرباح، أو باقة اتصالات طلابية StudentPlan).
3. طبق مبدأ الوراثة وتعدد الأشكال (Overriding) لتطبيق قواعد وحوافز مخصصة لكل نوع.
4. اضبط التحقق من صحة المعاملات وأطلق استثناءات مخصصة عند السحب الزائد أو العمليات غير الصالحة.
5. ارفع المشروع إلى GitHub مع مخطط هيكلي يوضح الأصناف والعلاقات بينها.`,
    },
  },
  {
    id: 'topic-6',
    displayOrder: 5,
    titleEn: '5. Data Structures, File I/O & Persistent Storage',
    titleAr: '٥. هياكل البيانات، التعامل مع الملفات والتخزين الدائم',
    descriptionEn: 'Hash maps, sets, dynamic collections, file streams, JSON serialization, and persistent data storage.',
    descriptionAr: 'جداول التجزئة، المجموعات، القوائم الديناميكية، تدفق الملفات، وتسلسل بيانات JSON والتخزين الدائم.',
    languages: ['python', 'cpp', 'java'],
    levels: ['basic', 'advanced'],
    lessons: ['lesson-10'],
    session: {
      type: 'recorded',
      platform: 'Google Drive',
      url: 'https://drive.google.com/file/d/1demo-hemma-files-storage/view',
      titleEn: 'Module 5 Recorded Session: File Handling & Serialization',
      titleAr: 'تسجيل محاضرة الوحدة الخامسة: التعامل مع الملفات والحفظ الدائم',
      duration: '50m',
      instructor: 'Dr. Al-Amin',
    },
    quiz: {
      id: 'quiz-6',
      titleEn: 'Module 5 Knowledge Check: Collections, Files & Persistence',
      titleAr: 'اختبار تقييم المفاهيم: هياكل البيانات وتدفق الملفات والتسلسل',
      questions: [
        {
          id: 'q6-1',
          questionEn: 'What is the average time complexity for key lookups in a Hash Map / Dictionary?',
          questionAr: 'ما هو التعقيد الزمني المتوسط للبحث عن مفتاح في جدول التجزئة (Hash Map / Dictionary)؟',
          optionsEn: ['O(1) constant time', 'O(N^2) quadratic time', 'O(N!) factorial time', 'O(log N!) time'],
          optionsAr: ['O(1) زمن ثابت (Constant Time)', 'O(N^2) زمن تربيعي', 'O(N!) زمن مضروب', 'O(log N!)'],
          correctIndex: 0,
          explanationEn: 'Hash tables compute a hash of the key to index directly into a bucket array, providing O(1) average lookup performance.',
          explanationAr: 'تحسب جداول التجزئة قيمة الـ Hash للمفتاح لتصل مباشرة لموقع التخزين، مما يمنحها زمناً ثابتاً O(1) في المتوسط.',
        },
        {
          id: 'q6-2',
          questionEn: 'Why should files always be accessed using context managers (with in Python, try-with-resources in Java, RAII in C++)?',
          questionAr: 'لماذا يجب دائماً فتح الملفات عبر مديري السياق (with في بايثون، try-with-resources في جافا، و RAII في C++)؟',
          optionsEn: [
            'To guarantee that file handles and OS descriptors are automatically closed even if an exception occurs.',
            'Because modern computers cannot open files without context managers.',
            'To delete the file immediately after reading.',
            'To double the font size of the text.',
          ],
          optionsAr: [
            'لضمان إغلاق مقابض الملفات وتحرير موارد نظام التشغيل تلقائياً حتى عند حدوث أخطاء أو استثناءات.',
            'لأن الحواسيب الحديثة لا يمكنها فتح الملفات بدون مدير سياق.',
            'لحذف الملف مباشرة بعد قراءته.',
            'لمضاعفة حجم خط النصوص البرمجية.',
          ],
          correctIndex: 0,
          explanationEn: 'Context managers guarantee deterministic resource cleanup, preventing operating system file handle leaks.',
          explanationAr: 'يضمن مدير السياق تحرير الموارد بشكل حتمي وإغلاق الملف حتى في حال حدوث استثناء، مانعاً تسريب مقابض الملفات في نظام التشغيل.',
        },
      ],
    },
    assignment: {
      id: 'assign-6',
      titleEn: 'Module 5 Project: Persistent Academic Records & Analytics Ledger',
      titleAr: 'مشروع الوحدة الخامسة: سجل الأرشيف الأكاديمي والتحليل الإحصائي الدائم',
      promptEn: `Create a persistent command-line ledger application (Python, C++, or Java):
1. Store records of students, topics, and scores using appropriate collections (dictionaries/maps/hash sets).
2. Save database state to disk using structured JSON or formatted CSV files.
3. Reload existing data on startup and handle missing or corrupt file errors gracefully.
4. Provide search, aggregation (average score, passing rate), and export features.
5. Push to GitHub with sample data files and comprehensive test instructions.`,
      promptAr: `أنشئ تطبيقاً برمجياً لحفظ وإدارة السجلات الأكاديمية مع التخزين الدائم على القرص:
1. خزن بيانات الطلاب ودرجاتهم باستخدام هياكل البيانات المناسبة (قواميس/خرائط ومجموعات).
2. احفظ حالة النظام على القرص في ملفات JSON منظمة أو ملفات CSV.
3. استرجع البيانات المحفوظة تلقائياً عند تشغيل البرنامج مع معالجة أخطاء فقدان الملفات.
4. وفر مزايا البحث، التجميع الإحصائي (المتوسطات ونسب النجاح)، وتصدير التقارير.
5. ارفع المشروع إلى GitHub مع عينات ملفات البيانات ودليل تشغيل كامل.`,
    },
  },
  {
    id: 'topic-4',
    displayOrder: 6,
    titleEn: '6. Applied AI, Data Science & Machine Learning (SAIR Community Track)',
    titleAr: '٦. الذكاء الاصطناعي، علم البيانات وتعلم الآلة (مسار مجتمع SAIR)',
    descriptionEn: 'NumPy vectorization, Pandas tabular data pipelines, and machine learning model training curated with Sudanese Artificial Intelligence Researchers (SAIR).',
    descriptionAr: 'المعالجة الشعاعية عبر NumPy، أنابيب معالجة البيانات بـ Pandas، وتدريب نماذج تعلم الآلة بالتعاون مع الباحثين السودانيين في الذكاء الاصطناعي (SAIR).',
    languages: ['python'],
    trackOnly: 'python',
    levels: ['basic', 'advanced'],
    sairTrack: true,
    lessons: ['lesson-6', 'lesson-7'],
    session: {
      type: 'recorded',
      platform: 'YouTube (SAIR)',
      url: 'https://youtube.com/watch?v=demo-sair-ai-sudan',
      titleEn: 'SAIR Masterclass: AI, NumPy Vectorization & ML in Sudan',
      titleAr: 'محاضرة مجتمع SAIR: الذكاء الاصطناعي وتسريع NumPy ونماذج تعلم الآلة',
      duration: '1h 45m',
      instructor: 'SAIR Research Team',
    },
    quiz: {
      id: 'quiz-4',
      titleEn: 'Module 6 Knowledge Check: AI, NumPy & Pandas (SAIR Track)',
      titleAr: 'اختبار تقييم المفاهيم: الذكاء الاصطناعي ومكتبات البيانات (مسار SAIR)',
      questions: [
        {
          id: 'q4-1',
          questionEn: 'Why is NumPy array vectorization dramatically faster than traditional Python loops for numerical calculations?',
          questionAr: 'لماذا تعتبر العمليات الشعاعية (Vectorization) في NumPy أسرع بكثير من حلقات بايثون التقليدية في العمليات الحسابية؟',
          codeSnippet: 'import numpy as np\n# Vectorized addition\nz = a + b',
          optionsEn: [
            'NumPy executes contiguous memory operations in optimized compiled C/Fortran code without Python interpreter loop overhead.',
            'NumPy automatically uploads data to remote cloud GPUs.',
            'NumPy converts all floating point numbers to integers.',
            'NumPy ignores precision errors to gain speed.',
          ],
          optionsAr: [
            'تنفذ NumPy العمليات على ذاكرة متجاورة عبر شيفرات C و Fortran مجمعة ومحسنة دون العبء التشغيلي لمفسر بايثون.',
            'تقوم NumPy برفع البيانات تلقائياً لمعالجات الرسوم السحابية GPU.',
            'تقوم NumPy بتحويل جميع الكسور إلى أعداد صحيحة لتسريع الحساب.',
            'تتجاهل NumPy الدقة الحسابية للحصول على سرعة أعلى.',
          ],
          correctIndex: 0,
          explanationEn: 'NumPy arrays are stored in contiguous memory blocks with homogeneous types (SIMD-capable), bypassing Python object pointer overhead and dynamic dispatch.',
          explanationAr: 'تُخزن مصفوفات NumPy في كتل ذاكرة متجاورة ذات نوع موحد، مما يسمح باستغلال تعليمات SIMD وتجاوز تفاسير مفسر بايثون البطيئة لكل عنصر.',
        },
        {
          id: 'q4-2',
          questionEn: 'In Pandas, which method is used to remove missing or null (NaN) records from a DataFrame?',
          questionAr: 'في مكتبة Pandas، ما هي الدالة المستخدمة لحذف السجلات التي تحتوي على قيم مفقودة (NaN)؟',
          optionsEn: ['df.dropna()', 'df.remove_nulls()', 'df.clean()', 'df.delete_empty()'],
          optionsAr: ['df.dropna()', 'df.remove_nulls()', 'df.clean()', 'df.delete_empty()'],
          correctIndex: 0,
          explanationEn: 'df.dropna() drops rows (or columns with axis=1) that contain null or NaN values, while df.fillna() imputes them.',
          explanationAr: 'الدالة df.dropna() تحذف الصفوف (أو الأعمدة) التي تحتوي على قيم مفقودة NaN، بينما تقوم df.fillna() بتعويضها.',
        },
        {
          id: 'q4-3',
          questionEn: 'Why must we split datasets into Training and Testing sets before training a Machine Learning model?',
          questionAr: 'لماذا يجب تقسيم البيانات إلى مجموعة تدريب (Training) ومجموعة اختبار (Testing) عند تدريب نماذج تعلم الآلة؟',
          optionsEn: [
            'To evaluate model generalization on unseen data and detect overfitting.',
            'Because Machine Learning algorithms cannot read files larger than 100 rows.',
            'To speed up download times for the dataset.',
            'It is only an optional practice with no impact on accuracy.',
          ],
          optionsAr: [
            'لتقييم قدرة النموذج على التعميم والتنبؤ على بيانات غير مسبوقة وكشف الإفراط في التخصيص (Overfitting).',
            'لأن خوارزميات تعلم الآلة لا تستطيع قراءة ملفات تتجاوز 100 سطر.',
            'لتسريع زمن تحميل البيانات من الإنترنت.',
            'إنها خطوة اختيارية فقط ليس لها أثر على دقة النموذج.',
          ],
          correctIndex: 0,
          explanationEn: 'Testing on unseen data ensures the model has learned true underlying patterns rather than simply memorizing the training dataset (overfitting).',
          explanationAr: 'تقييم النموذج على بيانات لم يسبق له رؤيتها يضمن تعلمه للأنماط الحقيقية بدلاً من مجرد حفظ بيانات التدريب عن ظهر قلب (Overfitting).',
        },
      ],
    },
    assignment: {
      id: 'assign-4',
      titleEn: 'Module 6 Project: SAIR Sudan Agri-Predictor & Disease Classification Model',
      titleAr: 'مشروع الوحدة السادسة: نظام التنبؤ الزراعي وتصنيف أمراض المحاصيل (مسار SAIR)',
      promptEn: `Build a Machine Learning / Data Science application addressing real-world agricultural or climate challenges in Sudan:
1. Load and clean an agricultural/rainfall tabular dataset using Pandas (or matrix representation in C++/Java).
2. Perform exploratory data analysis: compute statistical summaries (mean, variance, correlation) with NumPy.
3. Train a classification or regression model (e.g. Scikit-learn Logistic Regression / Random Forest or custom gradient descent).
4. Evaluate accuracy, Precision, Recall, and F1-Score on a dedicated test split.
5. Document your model architecture, data preprocessing pipeline, and key findings in a comprehensive README on GitHub.`,
      promptAr: `أنشئ تطبيقاً لتعلم الآلة وعلم البيانات لمعالجة تحديات واقعية في الزراعة والمناخ بالسودان:
1. قم بقراءة ومعالجة بيانات زراعية أو مناخية باستخدام Pandas (أو تمثيل المصفوفات في C++/Java).
2. نفذ تحليلاً استكشافياً للبيانات: احسب المتوسطات والتباين ومصفوفات الترابط باستخدام NumPy.
3. درب نموذج تصنيف أو انحدار (باستخدام Scikit-Learn كـ Logistic Regression أو خوارزمية مخصصة).
4. احسب مقاييس الدقة (Accuracy, Precision, Recall, F1-Score) على مجموعة الاختبار.
5. وثق هيكلية النموذج ومراحل معالجة البيانات والنتائج المستخلصة في ملف README تفصيلي على GitHub.`,
    },
  },
];

export const LESSONS = [
  {
    id: 'lesson-0',
    topicId: 'topic-0',
    displayOrder: 1,
    titleEn: 'Local Setup: IDE, Git & Creating Your Public GitHub Repo',
    titleAr: 'الإعداد المحلي: تثبيت بيئة العمل و Git وإنشاء مستودع GitHub عام',
    arabicStatus: 'approved',
    isPublished: true,
    version: 1,
    notesEn: `Setting up your local environment: VS Code, Git, and creating a public GitHub repository for submitting capstone projects.`,
    notesAr: `إعداد بيئة التطوير المحلية: محرر VS Code، أداة Git، وإنشاء مستودع عام على GitHub لتسليم مشاريع التخرج.`,
    codeSnippet: `# 1. Configure your identity in Git terminal:
git config --global user.name "Your Name"
git config --global user.email "your.email@university.edu.sd"

# 2. Initialize repository and add code:
git init
git add .
git commit -m "feat: Initial commit for Hemma project"

# 3. Push to public repository on GitHub:
git remote add origin https://github.com/your-username/my-hemma-project.git
git branch -M main
git push -u origin main`,
    languages: {
      python: {
        name: 'Python',
        basic: {
          notesEn: `Step 1: Install Visual Studio Code from code.visualstudio.com.
Step 2: Install Python 3.11+ from python.org or via package manager.
Step 3: Open terminal in VS Code (Ctrl+\` or Cmd+\`) and verify: python3 --version.
Step 4: Initialize Git repository and create your first hello.py file.`,
          notesAr: `الخطوة ١: ثبّت محرر Visual Studio Code من الموقع الرسمي.
الخطوة ٢: ثبّت بايثون 3.11+ من موقع python.org.
الخطوة ٣: افتح الطرفية في VS Code وتأكد من التثبيت: python3 --version.
الخطوة ٤: أنشئ ملف hello.py وابدأ بتطبيق أوامر Git.`,
          codeSnippet: `# Python verification:
import sys
print(f"Python runtime active: {sys.version.split()[0]}")
print("Git repository ready for local development!")`,
          expectedOutput: `Python runtime active: 3.12.1\nGit repository ready for local development!`,
        },
        advanced: {
          notesEn: `Advanced Setup: Setting up virtual environments (.venv) and .gitignore for Python projects:
python3 -m venv .venv
source .venv/bin/activate  # On Linux/macOS
.venv\\Scripts\\activate     # On Windows`,
          notesAr: `الإعداد المتقدم: إنشاء بيئة افتراضية (.venv) وملف .gitignore لتجنب رفع الملفات المؤقتة.`,
          codeSnippet: `# Recommended .gitignore for Python:
# __pycache__/
# .venv/
# *.pyc`,
          expectedOutput: `Virtual environment configured cleanly.`,
        },
      },
      cpp: {
        name: 'C++',
        basic: {
          notesEn: `Install GCC/Clang and the C/C++ Extension Pack in VS Code:
Verify compiler: g++ --version
Compile: g++ -std=c++20 main.cpp -o app`,
          notesAr: `تثبيت مترجم GCC/Clang وإضافة C++ في VS Code، والتحقق عبر g++ --version.`,
          codeSnippet: `// Verify C++ Compiler
#include <iostream>

int main() {
    std::cout << "C++ Compiler ready! Git initialized." << std::endl;
    return 0;
}`,
          expectedOutput: `C++ Compiler ready! Git initialized.`,
        },
        advanced: {
          notesEn: `Modern CMake build configuration and compile flags (-Wall -Wextra -O2).`,
          notesAr: `إعداد نظام البناء CMake وتفعيل تنبيهات المترجم.`,
          codeSnippet: `// CMake / Makefile ready`,
          expectedOutput: `Build configuration valid.`,
        },
      },
      java: {
        name: 'Java',
        basic: {
          notesEn: `Install OpenJDK 21 LTS and the Java Extension Pack:
Verify compiler: javac --version
Run: java Main.java`,
          notesAr: `تثبيت OpenJDK 21 LTS وحزمة جافا في VS Code والتحقق عبر javac --version.`,
          codeSnippet: `// Verify Java Runtime
public class Main {
    public static void main(String[] args) {
        System.out.println("Java JDK 21 ready! Local environment initialized.");
    }
}`,
          expectedOutput: `Java JDK 21 ready! Local environment initialized.`,
        },
        advanced: {
          notesEn: `Configuring Maven or Gradle for reproducible builds across operating systems.`,
          notesAr: `إعداد أدوات البناء Maven أو Gradle للأنظمة المؤسسية.`,
          codeSnippet: `// Gradle / Maven verification`,
          expectedOutput: `Build tool ready.`,
        },
      },
    },
  },
  {
    id: 'lesson-1',
    topicId: 'topic-1',
    displayOrder: 1,
    titleEn: 'Variables, Arithmetic & User Input',
    titleAr: 'المتغيرات، العمليات الحسابية، ومدخلات المستخدم',
    arabicStatus: 'approved',
    isPublished: true,
    version: 1,
    recordingLink: 'https://meet.google.com/xyz-hemma-demo',
    // Fallback top-level properties for backward compatibility
    notesEn: `In this lesson, you will learn how to declare variables and interact with user input. Choose your preferred language tab (Python, C++, Java) and level (Basic or Advanced) above.`,
    notesAr: `في هذا الدرس، ستتعلم كيفية تعريف المتغيرات والتعامل مع مدخلات المستخدم. اختر لغة البرمجة والمستوى (أساسي أو متقدم) من الأزرار بالأعلى.`,
    codeSnippet: `# Python: Variables & Terminal Input
user_name = input("Enter your name: ")
study_hours = int(input("How many hours do you plan to study per week? "))
daily_average = study_hours / 7.0
print(f"Welcome, {user_name}! Your daily target is {daily_average:.2f} hours.")`,
    languages: {
      python: {
        name: 'Python',
        basic: {
          notesEn: `Python is dynamically typed: variables are created automatically when assigned a value.
- input() captures text input from the console as a string.
- Use int() or float() to convert user text to numbers before performing arithmetic.
- Arithmetic operators: +, -, *, /, // (floor division), % (modulo), ** (exponentiation).`,
          notesAr: `لغة بايثون ديناميكية النوع: يتم إنشاء المتغيرات تلقائياً بمجرد إسناد قيمة لها.
- تستقبل دالة input() النصوص من المستخدم عبر سطر الأوامر.
- استخدم int() أو float() لتحويل النصوص إلى أرقام لإجراء العمليات الحسابية.
- العمليات الحسابية: الجمع (+)، الطرح (-)، الضرب (*)، القسمة (/)، القسمة الصحيحة (//)، باقي القسمة (%)، والأسس (**).`,
          codeSnippet: `# Python Basic: Variables & Input
name = input("Enter student name: ")
hours = float(input("Weekly study hours: "))
daily = hours / 7.0

print(f"Student: {name}")
print(f"Daily Target: {daily:.2f} hours")`,
        },
        advanced: {
          notesEn: `Advanced Input Handling & Type Validation (SAIR AI Foundation):
- Strict typing with type hints (PEP 484) and exception handling (try-except).
- Validating numerical input for data pipelines and parsing multi-value inputs using map() and list comprehension.
- Structuring configuration parameters for scientific computing models.`,
          notesAr: `معالجة المدخلات المتقدمة والتحقق من الأنواع (تأسيس مسار SAIR للذكاء الاصطناعي):
- استخدام التلميحات النوعية (Type Hints) ومعالجة الاستثناءات (try-except).
- التحقق الصارم من صحة المدخلات العددية لأنابيب البيانات وقراءة مدخلات متعددة عبر map() وقوائم الفهم.
- تهيئة معاملات الإعدادات لنماذج الحوسبة العلمية.`,
          codeSnippet: `# Python Advanced: Robust Input Parsing for Data Pipelines
from typing import List

def capture_metrics() -> List[float]:
    raw = input("Enter sensor readings separated by space: ")
    try:
        readings = [float(val.strip()) for val in raw.split(",") if val.strip()]
        if not readings:
            raise ValueError("No valid numbers provided.")
        return readings
    except ValueError as e:
        print(f"[Error] Invalid numeric input: {e}")
        return []

data = capture_metrics()
if data:
    mean_val = sum(data) / len(data)
    print(f"Captured {len(data)} readings | Mean: {mean_val:.4f}")`,
        },
      },
      cpp: {
        name: 'C++',
        basic: {
          notesEn: `C++ is statically typed and compiled: every variable must have a declared type (int, double, std::string).
- std::cin reads formatted input from the standard input stream.
- std::cout writes formatted output to the console.
- #include <iostream> provides stream I/O functionality.`,
          notesAr: `لغة C++ ساكنة النوع ومجمعة: يجب تحديد نوع كل متغير (int, double, std::string) صراحة قبل استخدامه.
- يستخدم std::cin لقراءة المدخلات من سطر الأوامر.
- يستخدم std::cout لطباعة المخرجات إلى الشاشة.
- تضمين المكتبة <iostream> يوفر دوال الإدخال والإخراج.`,
          codeSnippet: `// C++ Basic: Variables & Console I/O
#include <iostream>
#include <string>
#include <iomanip>

int main() {
    std::string name;
    double weekly_hours = 0.0;

    std::cout << "Enter student name: ";
    std::getline(std::cin, name);

    std::cout << "Weekly study hours: ";
    std::cin >> weekly_hours;

    double daily = weekly_hours / 7.0;

    std::cout << "Student: " << name << std::endl;
    std::cout << std::fixed << std::setprecision(2);
    std::cout << "Daily Target: " << daily << " hours" << std::endl;

    return 0;
}`,
        },
        advanced: {
          notesEn: `Advanced C++: Fast I/O, Safe Memory Types & Stream Optimization:
- Untying std::cin and std::cout for ultra-fast performance in algorithmic processing and high-volume dataset ingestion.
- Preventing buffer overflows and handling invalid stream states (std::cin.fail()).`,
          notesAr: `مستوى C++ المتقدم: تسريع الإدخال/الإخراج ومعالجة أخطاء الذاكرة:
- فك ارتباط std::cin مع std::cout لتحقيق أقصى سرعة في معالجة البيانات الكبيرة والمسائل الخوارزمية.
- التعامل مع حالات فشل القراءة (std::cin.fail()) وتنظيف الذاكرة المؤقتة.`,
          codeSnippet: `// C++ Advanced: Fast Stream Ingestion & Stream State Recovery
#include <iostream>
#include <limits>
#include <vector>

void fast_io() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);
}

int main() {
    fast_io();
    double budget = 0.0;

    std::cout << "Enter valid budget in SDG: ";
    while (!(std::cin >> budget) || budget < 0) {
        std::cout << "Invalid input. Please enter a positive number: ";
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\\n');
    }

    std::cout << "Allocated Budget: " << budget << " SDG\\n";
    return 0;
}`,
        },
      },
      java: {
        name: 'Java',
        basic: {
          notesEn: `Java is an object-oriented, strongly typed language running on the JVM (Java Virtual Machine).
- Use java.util.Scanner to parse primitive types and strings from System.in.
- System.out.println() prints to standard console output.
- All code resides inside class declarations.`,
          notesAr: `لغة جافا كائنية التوجه وصارمة الأنواع وتعمل عبر آلة جافا الافتراضية (JVM).
- يُستخدم الكائن Scanner من حزمة java.util لقراءة المدخلات من System.in.
- دالة System.out.println() تطبع النصوص إلى شاشة المخرجات.
- توضع كافة الشيفرات البرمجية داخل تعريف الأصناف (Classes).`,
          codeSnippet: `// Java Basic: Scanner & Console Output
import java.util.Scanner;

public class StudentInput {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter student name: ");
        String name = scanner.nextLine();

        System.out.print("Weekly study hours: ");
        double weeklyHours = scanner.nextDouble();

        double dailyAverage = weeklyHours / 7.0;

        System.out.println("Student: " + name);
        System.out.printf("Daily Target: %.2f hours%n", dailyAverage);

        scanner.close();
    }
}`,
        },
        advanced: {
          notesEn: `Advanced Java: BufferedReader, Parsing & Resource Management:
- Using BufferedReader and InputStreamReader for thread-safe, high-throughput input reading.
- Utilizing try-with-resources (AutoCloseable) to eliminate resource leaks.
- NumberFormatException handling for production enterprise applications.`,
          notesAr: `مستوى جافا المتقدم: القراءة السريعة عبر BufferedReader وإدارة الموارد:
- استخدام BufferedReader و InputStreamReader لمعالجة المدخلات الضخمة بأعلى كفاءة.
- استخدام صيغة try-with-resources لضمان إغلاق مسارات الإدخال تلقائياً ومنع تسريب الموارد.
- معالجة استثناءات التحويل العددي NumberFormatException في التطبيقات الحقيقية.`,
          codeSnippet: `// Java Advanced: BufferedReader with AutoCloseable Safety
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;

public class HighThroughputInput {
    public static void main(String[] args) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(System.in))) {
            System.out.print("Enter monthly budget (SDG): ");
            String raw = reader.readLine();
            double budget = Double.parseDouble(raw.trim());

            if (budget <= 0) {
                System.err.println("Warning: Budget must be strictly positive.");
                return;
            }

            System.out.printf("Verified Budget: %,.2f SDG%n", budget);
        } catch (NumberFormatException e) {
            System.err.println("Input is not a valid floating-point number.");
        } catch (IOException e) {
            System.err.println("I/O error reading from console.");
        }
    }
}`,
        },
      },
    },
  },
  {
    id: 'lesson-2',
    topicId: 'topic-1',
    displayOrder: 2,
    titleEn: 'Strings, Formatting & Type Conversion',
    titleAr: 'النصوص، التنسيق، والتحويل بين الأنواع',
    arabicStatus: 'approved',
    isPublished: true,
    version: 1,
    recordingLink: 'https://meet.google.com/xyz-hemma-demo-2',
    notesEn: `Strings are fundamental for representing textual information across all languages. Switch tabs above to see Python, C++, and Java syntax.`,
    notesAr: `تعتبر النصوص ركيزة أساسية لتمثيل البيانات النصية في كافة لغات البرمجة. انتقل بين التبويبات بالأعلى للاطلاع على أمثلة بايثون و C++ وجافا.`,
    codeSnippet: `# String formatting with Python f-strings
city = "Khartoum"
temp = 38.5
status = f"Current temperature in {city} is {temp}°C."
print(status.upper())`,
    languages: {
      python: {
        name: 'Python',
        basic: {
          notesEn: `Strings in Python are immutable sequences of Unicode characters.
- String methods: .upper(), .lower(), .strip(), .replace(), .split().
- Formatted string literals (f-strings) provide concise variable interpolation.`,
          notesAr: `النصوص في بايثون سلاسل غير قابلة للتعديل المباشر (Immutable) من محارف يونيكود.
- دوال النصوص الشائعة: .upper(), .lower(), .strip(), .replace(), .split().
- تتيح نصوص f-strings دمج المتغيرات بسلاسة وأناقة.`,
          codeSnippet: `# Python Basic: String Methods & f-strings
city = "Khartoum"
temp = 38.5
status = f"Current temperature in {city} is {temp:.1f}°C."
print(status.upper())
print("Cleaned text:", "   Hemma Sudan   ".strip())`,
        },
        advanced: {
          notesEn: `Advanced String Processing (NLP & Feature Engineering in SAIR):
- Regular expressions (re module) for data sanitization.
- Handling Arabic and English bilingual text with Unicode normalization (unicodedata).
- Tokenization and string embeddings preparation.`,
          notesAr: `معالجة النصوص المتقدمة (تجهيز معالجة اللغات الطبيعية في مسار SAIR):
- استخدام التعابير النمطية (Regular Expressions عبر مكتبة re) لتنظيف البيانات.
- معالجة النصوص ثنائية اللغة (العربية والإنجليزية) وضبط ترميز يونيكود عبر unicodedata.
- تقطيع النصوص (Tokenization) لتهيئة الكلمات لنماذج الذكاء الاصطناعي.`,
          codeSnippet: `# Python Advanced: Text Cleaning & Unicode Normalization (NLP Pipeline)
import re
import unicodedata

raw_arabic_text = "الذكاء   الاصطناعي  في  السودان (SAIR Community 2026)!"

# 1. Normalize Unicode
normalized = unicodedata.normalize('NFKC', raw_arabic_text)

# 2. Clean extra whitespace and punctuation
cleaned = re.sub(r'\\s+', ' ', normalized).strip()

# 3. Tokenize into words
tokens = cleaned.split(' ')
print(f"Tokens ({len(tokens)}):", tokens)`,
        },
      },
      cpp: {
        name: 'C++',
        basic: {
          notesEn: `In modern C++, std::string is a dynamic character container with memory safety.
- Concatenation using the + operator.
- Methods: .length(), .substr(), .find().`,
          notesAr: `في لغة C++ الحديثة، يعتبر std::string حاوية ديناميكية آمنة لإدارة النصوص في الذاكرة.
- دمج النصوص باستخدام معامل الجمع (+).
- دوال الفحص والتقطيع: .length(), .substr(), .find().`,
          codeSnippet: `// C++ Basic: std::string Operations
#include <iostream>
#include <string>

int main() {
    std::string city = "Omdurman";
    double temp = 41.2;

    std::string report = "City: " + city + " | Temp: " + std::to_string(temp);
    std::cout << report << std::endl;
    std::cout << "Length: " << report.length() << " chars" << std::endl;

    return 0;
}`,
        },
        advanced: {
          notesEn: `Advanced C++: std::string_view for Zero-Copy String Parsing:
- std::string_view (C++17) avoids costly heap allocations when inspecting string slices.
- Essential for high-performance NLP tokenizers and text search engines.`,
          notesAr: `مستوى C++ المتقدم: استخدام std::string_view للتقطيع عالي الأداء بدون نسخ الذاكرة:
- ميزة std::string_view (منذ C++17) تتجنب حجز الذاكرة الديناميكية (Heap Allocation) المكلفة عند فحص أجزاء النصوص.
- أداة بالغة الأهمية لمحركات معالجة اللغات الطبيعية والبحث النصي السريع.`,
          codeSnippet: `// C++ Advanced: Zero-Copy Tokenization with std::string_view
#include <iostream>
#include <string_view>
#include <vector>

std::vector<std::string_view> split_fast(std::string_view text, char delimiter) {
    std::vector<std::string_view> tokens;
    size_t start = 0;
    size_t end = text.find(delimiter);

    while (end != std::string_view::npos) {
        tokens.push_back(text.substr(start, end - start));
        start = end + 1;
        end = text.find(delimiter, start);
    }
    tokens.push_back(text.substr(start));
    return tokens;
}

int main() {
    std::string_view log_line = "2026-11-21,AI_MODEL,ACCURACY=0.942,LOSS=0.081";
    auto parts = split_fast(log_line, ',');
    for (auto part : parts) {
        std::cout << "Token: " << part << std::endl;
    }
    return 0;
}`,
        },
      },
      java: {
        name: 'Java',
        basic: {
          notesEn: `In Java, String is immutable. Modifying a string creates a new instance.
- Methods: .length(), .substring(), .toLowerCase(), .contains(), .replace().
- String formatting with String.format() or System.out.printf().`,
          notesAr: `في جافا، نصوص String غير قابلة للتغيير المباشر في الذاكرة.
- دوال الفحص: .length(), .substring(), .toLowerCase(), .contains(), .replace().
- التنسيق عبر String.format() أو System.out.printf().`,
          codeSnippet: `// Java Basic: String Manipulation
public class StringBasics {
    public static void main(String[] args) {
        String university = "University of Khartoum";
        String city = "Khartoum";
        int founded = 1902;

        String summary = String.format("%s, located in %s, was founded in %d.", university, city, founded);
        System.out.println(summary);
        System.out.println("Uppercase: " + summary.toUpperCase());
    }
}`,
        },
        advanced: {
          notesEn: `Advanced Java: StringBuilder, Text Blocks & Memory Optimization:
- Using StringBuilder for efficient loop string concatenation without garbage collection churn.
- Modern Java Text Blocks (triple quotes """ ) for multi-line JSON/SQL queries.`,
          notesAr: `مستوى جافا المتقدم: كائن StringBuilder ونصوص القوالب وإدارة الذاكرة:
- استخدام StringBuilder لتجميع النصوص داخل الحلقات التكرارية دون إثقال جامع النفايات (GC).
- نصوص القوالب الحديثة (Text Blocks """ ) لكتابة استعلامات وقوالب متعددة الأسطر.`,
          codeSnippet: `// Java Advanced: StringBuilder for High-Volume Concatenation
public class StringPerformance {
    public static void main(String[] args) {
        StringBuilder builder = new StringBuilder();
        builder.append("{\\n");
        for (int i = 1; i <= 5; i++) {
            builder.append(String.format("  \\"reading_%d\\": %.2f%s\\n", i, Math.random() * 100, i == 5 ? "" : ","));
        }
        builder.append("}");

        System.out.println("Constructed JSON Payload:\\n" + builder.toString());
    }
}`,
        },
      },
    },
  },
  {
    id: 'lesson-3',
    topicId: 'topic-2',
    displayOrder: 1,
    titleEn: 'Conditional Statements (if, elif, else)',
    titleAr: 'الجمل الشرطية (if, elif, else)',
    arabicStatus: 'approved',
    isPublished: true,
    version: 1,
    recordingLink: 'https://meet.google.com/xyz-hemma-demo-3',
    notesEn: `Conditionals evaluate boolean conditions to route code execution through specific branches.`,
    notesAr: `تقوم الجمل الشرطية بفحص الشروط المنطقية لتوجيه مسار تنفيذ البرنامج عبر فروع محددة.`,
    codeSnippet: `score = int(input("Enter exam score: "))
if score >= 85:
    grade = "Distinction"
elif score >= 60:
    grade = "Pass"
else:
    grade = "Needs Improvement"
print(f"Result: {grade}")`,
    languages: {
      python: {
        name: 'Python',
        basic: {
          notesEn: `Python uses if, elif, and else with strict indentation (4 spaces).
- Logical operators: and, or, not.
- Comparison operators: ==, !=, >, <, >=, <=.`,
          notesAr: `تستخدم بايثون الكلمات if, elif, else مع اعتماد المسافات البادئة (Indentation) بدقة.
- المعاملات المنطقية: and, or, not.
- معاملات المقارنة: ==, !=, >, <, >=, <=.`,
          codeSnippet: `# Python Basic: Grade Classifier
score = int(input("Enter your exam score: "))
if score >= 85:
    grade = "Distinction"
elif score >= 60:
    grade = "Pass"
else:
    grade = "Needs Improvement"
print(f"Result: {grade}")`,
        },
        advanced: {
          notesEn: `Advanced Python: Structural Pattern Matching (match/case) & Decision Trees:
- Python 3.10+ match-case statement for cleaner branching than nested if/elif ladders.
- Guard expressions (if condition inside case).`,
          notesAr: `مستوى بايثون المتقدم: مطابقة الأنماط الهيكلية (match/case) وشروط الحراسة:
- استخدام تعبير match/case (منذ Python 3.10) لتبسيط الشروط المعقدة ومحاكاة شجرات القرار.
- استخدام شروط الحراسة (Guards) داخل كل حالة مطابقة.`,
          codeSnippet: `# Python Advanced: Structural Pattern Matching with Guards
def classify_sensor_signal(signal: dict) -> str:
    match signal:
        case {"type": "temp", "val": v} if v > 45.0:
            return "ALERT: High Temperature Warning!"
        case {"type": "temp", "val": v} if v >= 20.0:
            return "NORMAL: Optimal Climate Condition"
        case {"type": "temp", "val": _}:
            return "WARNING: Unusually Cold Reading"
        case {"type": "power", "online": False}:
            return "CRITICAL: Power Station Offline"
        case _:
            return "UNKNOWN: Telemetry packet format unrecognized"

reading = {"type": "temp", "val": 48.7}
print(classify_sensor_signal(reading))`,
        },
      },
      cpp: {
        name: 'C++',
        basic: {
          notesEn: `C++ uses if, else if, else, and switch statements with curly braces {}.
- Logical operators: && (AND), || (OR), ! (NOT).`,
          notesAr: `تستخدم C++ الكلمات if, else if, else و switch مع الأقواس المعقوفة {}.
- المعاملات المنطقية: && (و), || (أو), ! (نفي).`,
          codeSnippet: `// C++ Basic: Grade Evaluation
#include <iostream>
#include <string>

int main() {
    int score = 78;
    std::string grade;

    if (score >= 85) {
        grade = "Distinction";
    } else if (score >= 60) {
        grade = "Pass";
    } else {
        grade = "Needs Improvement";
    }

    std::cout << "Grade: " << grade << std::endl;
    return 0;
}`,
        },
        advanced: {
          notesEn: `Advanced C++: constexpr if & [[likely]] / [[unlikely]] Branch Predictor Hints:
- if constexpr (C++17) evaluates branches at compile time.
- Branch prediction attributes ([[likely]] / [[unlikely]]) help CPU pipeline optimization.`,
          notesAr: `مستوى C++ المتقدم: شروط زمن الترجمة (constexpr if) وتوجيه المعالج ([[likely]]):
- استخدام if constexpr للتحقق من الشروط أثناء الترجمة دون أي عبء تشغيلي وقت التنفيذ.
- استخدام توجيهات التنبؤ بالتفرع ([[likely]] و [[unlikely]]) لتحسين كفاءة خط أنابيب المعالج (CPU Pipeline).`,
          codeSnippet: `// C++ Advanced: Branch Optimization for High-Performance Inference
#include <iostream>

enum class QualityTier { High, Standard, Low };

template <QualityTier T>
void process_packet(int value) {
    if constexpr (T == QualityTier::High) {
        std::cout << "Processing with full floating-point precision\\n";
    } else {
        std::cout << "Processing with quantized integer operations\\n";
    }
}

int main() {
    int error_code = 0;
    if (error_code == 0) [[likely]] {
        process_packet<QualityTier::High>(100);
    } else [[unlikely]] {
        std::cerr << "Emergency pipeline fall-through\\n";
    }
    return 0;
}`,
        },
      },
      java: {
        name: 'Java',
        basic: {
          notesEn: `Java conditional structures require strict boolean expressions inside if condition parentheses.
- Ternary operator syntax: condition ? trueVal : falseVal.`,
          notesAr: `تشترط جافا وجود تعبير منطقي صريح (boolean) داخل أقواس جملة if.
- المعامل الثلاثي المختصر: condition ? trueVal : falseVal.`,
          codeSnippet: `// Java Basic: Grade Evaluation
public class GradeEvaluator {
    public static void main(String[] args) {
        int score = 82;
        String classification;

        if (score >= 85) {
            classification = "Distinction";
        } else if (score >= 60) {
            classification = "Pass";
        } else {
            classification = "Needs Improvement";
        }

        System.out.println("Result: " + classification);
    }
}`,
        },
        advanced: {
          notesEn: `Advanced Java: Pattern Matching for switch (Java 21):
- Type pattern matching in switch statements with 'when' clauses.
- Eliminating fragile instanceof chains.`,
          notesAr: `مستوى جافا المتقدم: مطابقة الأنماط في جمل switch (Java 21):
- فحص أنواع الكائنات وتفريغها مباشرة داخل switch مع شروط when.
- الاستغناء عن سلاسل فحص الكائنات الطويلة instanceof.`,
          codeSnippet: `// Java Advanced: Modern Pattern Matching Switch
public class PatternSwitchDemo {
    public static void main(String[] args) {
        Object response = 99.4;

        String description = switch (response) {
            case Integer i -> "Integer score: " + i;
            case Double d when d >= 90.0 -> "Top Percentile Double: " + d;
            case Double d -> "Standard Floating Metric: " + d;
            case String s -> "Text Message: " + s;
            case null -> "Null packet received";
            default -> "Unhandled payload type";
        };

        System.out.println(description);
    }
}`,
        },
      },
    },
  },
  {
    id: 'lesson-4',
    topicId: 'topic-2',
    displayOrder: 2,
    titleEn: 'Loops and Iterations (while & for)',
    titleAr: 'حلقات التكرار (while و for)',
    arabicStatus: 'approved',
    isPublished: true,
    version: 1,
    recordingLink: 'https://meet.google.com/xyz-hemma-demo-4',
    notesEn: `Loops automate repetitive tasks. A for loop iterates over sequences, while a while loop repeats as long as a condition evaluates to True.`,
    notesAr: `تستخدم الحلقات لتكرار العمليات التلقائية. تدور حلقة for على عناصر متسلسلة، بينما تستمر حلقة while ما دام الشرط صحيحاً.`,
    codeSnippet: `total = 0
for i in range(1, 6):
    total += i
print(f"Sum of 1 to 5 is: {total}")`,
    languages: {
      python: {
        name: 'Python',
        basic: {
          notesEn: `Python for loops iterate over iterable objects (lists, tuples, ranges).
- range(start, stop, step) generates sequences.
- while loop continues until the condition becomes False.
- break exits the loop; continue jumps to the next iteration.`,
          notesAr: `تدور حلقات for في بايثون على الكائنات القابلة للتكرار (القوائم، المجموعات، ونطاقات range).
- الدالة range(start, stop, step) تولد متتاليات رقمية.
- تستمر حلقة while بالعمل حتى يصبح الشرط خاطئاً (False).
- الأمر break ينهي الحلقة فوراً، والأمر continue ينتقل للتكرار التالي.`,
          codeSnippet: `# Python Basic: Summing with a for loop
total = 0
for i in range(1, 6):
    total += i
print(f"Sum of 1 to 5 is: {total}")`,
        },
        advanced: {
          notesEn: `Advanced Python: List Comprehensions, Generators & itertools:
- Memory-efficient generator expressions for processing massive datasets without filling RAM.
- zip(), enumerate(), and itertools for mathematical combinations.`,
          notesAr: `مستوى بايثون المتقدم: قوائم الفهم والمولدات (Generators) ومكتبة itertools:
- استخدام تعابير التوليد الموفرة للذاكرة لمعالجة ملايين السجلات دون استهلاك الرام.
- الدوال المساعدة: zip() للدمج المتوازي، enumerate() للترقيم، ومكتبة itertools للتوافيق والتباديل.`,
          codeSnippet: `# Python Advanced: Stream Processing with Generators
def streaming_batch_generator(limit: int):
    val = 1
    while val <= limit:
        # Yield single item without buffering entire list in RAM
        yield val * 2
        val += 1

# Process 10,000,000 items with near-zero memory footprint
batch_stream = streaming_batch_generator(5)
for item in batch_stream:
    print(f"Streamed Batch Item: {item}")`,
        },
      },
      cpp: {
        name: 'C++',
        basic: {
          notesEn: `C++ provides traditional counter-based for loops, range-based for loops (C++11), and while/do-while loops.`,
          notesAr: `توفر C++ حلقات التكرار التقليدية بحساب العداد، وحلقات النطاق الحديثة (Range-based for)، بالإضافة إلى while و do-while.`,
          codeSnippet: `// C++ Basic: Counting and Accumulation
#include <iostream>

int main() {
    int total = 0;
    for (int i = 1; i <= 5; ++i) {
        total += i;
    }
    std::cout << "Sum from 1 to 5 is: " << total << std::endl;
    return 0;
}`,
        },
        advanced: {
          notesEn: `Advanced C++: Loop Unrolling & Parallel Algorithms (std::execution):
- Parallel execution policies (std::execution::par) in modern C++ standard algorithms.
- Vectorized array accumulation using cache-friendly iteration order.`,
          notesAr: `مستوى C++ المتقدم: فك الحلقات والتنفيذ المتوازي عبر خوارزميات المعيار الحديثة:
- استخدام سياسات التنفيذ المتوازي (std::execution::par) لتسريع المعالجة على كافة أنوية المعالج.
- ترتيب المرور على المصفوفات وفق تسلسل الذاكرة لتعظيم الاستفادة من الذاكرة المخبئية (CPU Cache).`,
          codeSnippet: `// C++ Advanced: Parallel Transform & Accumulation
#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>

int main() {
    std::vector<int> numbers = {10, 20, 30, 40, 50};

    // Range-based iteration with auto reference
    long long sum = 0;
    for (const auto& num : numbers) {
        sum += num;
    }

    std::cout << "Parallel Accumulation: " << sum << std::endl;
    return 0;
}`,
        },
      },
      java: {
        name: 'Java',
        basic: {
          notesEn: `Java supports standard for loops, enhanced for-each loops over arrays and collections, and while loops.`,
          notesAr: `تدعم جافا حلقات for التقليدية، وحلقات for-each المحسنة للمرور على المصفوفات والمجموعات، بالإضافة إلى while.`,
          codeSnippet: `// Java Basic: Loop Iteration
public class LoopDemo {
    public static void main(String[] args) {
        int sum = 0;
        for (int i = 1; i <= 5; i++) {
            sum += i;
        }
        System.out.println("Sum of 1 to 5 is: " + sum);
    }
}`,
        },
        advanced: {
          notesEn: `Advanced Java: Streams API & Parallel Streaming:
- Functional stream pipeline: .filter(), .map(), .reduce().
- .parallelStream() for automatic fork-join pool execution across CPU cores.`,
          notesAr: `مستوى جافا المتقدم: واجهة التدفق Streams API والمعالجة المتوازية:
- بناء أنابيب العمليات الوظيفية: .filter(), .map(), .reduce().
- استخدام .parallelStream() لتوزيع الحسابات تلقائياً على أنوية المعالج.`,
          codeSnippet: `// Java Advanced: Parallel Stream Reduction
import java.util.List;

public class StreamReduction {
    public static void main(String[] args) {
        List<Integer> values = List.of(10, 20, 30, 40, 50);

        int total = values.parallelStream()
                          .map(v -> v * 2)
                          .reduce(0, Integer::sum);

        System.out.println("Parallel Stream Reduced Total: " + total);
    }
}`,
        },
      },
    },
  },
  {
    id: 'lesson-5',
    topicId: 'topic-3',
    displayOrder: 1,
    titleEn: 'Defining Reusable Functions & Scope',
    titleAr: 'تعريف الدوال القابلة لإعادة الاستخدام ونطاق المتغيرات',
    arabicStatus: 'approved',
    isPublished: true,
    version: 1,
    recordingLink: 'https://meet.google.com/xyz-hemma-demo-5',
    notesEn: `Functions help break problems into manageable blocks, reduce repetition, and make code modular and testable.`,
    notesAr: `تساعد الدوال على تقسيم المشكلات إلى أجزاء سهلة الإدارة، وتمنع تكرار الكود، وتسهل اختباره وصيانته.`,
    codeSnippet: `def calculate_gpa(scores):
    if not scores:
        return 0.0
    return sum(scores) / len(scores)

my_scores = [88, 92, 79, 95]
print(f"Your average score is: {calculate_gpa(my_scores):.2f}")`,
    languages: {
      python: {
        name: 'Python',
        basic: {
          notesEn: `In Python, functions are defined using the def keyword.
- Parameters allow passing inputs, and return returns outputs.
- Default arguments allow optional parameters.`,
          notesAr: `تُعرف الدوال في بايثون باستخدام الكلمة المفتاحية def.
- المعاملات تتيح تمرير المدخلات، بينما تعيد جملة return النتيجة المطلوبة.
- المعاملات الافتراضية تجعل تمرير بعض القيم اختيارياً.`,
          codeSnippet: `# Python Basic: Function Definition
def calculate_gpa(scores, bonus=0.0):
    if not scores:
        return 0.0
    return (sum(scores) / len(scores)) + bonus

scores_list = [88, 92, 79, 95]
print(f"Calculated GPA: {calculate_gpa(scores_list, bonus=1.5):.2f}")`,
        },
        advanced: {
          notesEn: `Advanced Python: Decorators, Closures & Pure Functional Pipelines:
- Function decorators (@decorator) for logging, timing, and caching (@lru_cache).
- Higher-order functions that accept or return other functions.`,
          notesAr: `مستوى بايثون المتقدم: المزخرفات (Decorators) والدوال من الرتب العليا:
- استخدام المزخرفات (@decorator) لتتبع الأداء، قياس زمن التنفيذ، والتخزين المؤقت (@lru_cache).
- الدوال من الرتب العليا (Higher-Order Functions) التي تستقبل أو تعيد دوالاً أخرى.`,
          codeSnippet: `# Python Advanced: Timing Decorator & Memoization
import time
from functools import wraps, lru_cache

def benchmark(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        result = func(*args, **kwargs)
        duration = time.perf_counter() - t0
        print(f"[{func.__name__}] executed in {duration * 1000:.3f} ms")
        return result
    return wrapper

@benchmark
@lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("Fibonacci(30):", fibonacci(30))`,
        },
      },
      cpp: {
        name: 'C++',
        basic: {
          notesEn: `In C++, functions must declare their return type and parameter types explicitly.
- Pass by value makes a copy of the argument.
- Pass by reference (&) allows modifying the original variable without copying.`,
          notesAr: `في C++ يجب تحديد نوع القيمة المرجعة ونوع كل معامل صراحة.
- التمرير بالقيمة (By Value) ينشئ نسخة جديدة من المتغير.
- التمرير بالمرجع (& By Reference) يتيح التعديل على المتغير الأصلي مباشرة دون نسخ.`,
          codeSnippet: `// C++ Basic: Functions with References
#include <iostream>
#include <vector>
#include <numeric>

double calculate_average(const std::vector<double>& scores) {
    if (scores.empty()) return 0.0;
    double sum = std::accumulate(scores.begin(), scores.end(), 0.0);
    return sum / scores.size();
}

int main() {
    std::vector<double> scores = {88.5, 92.0, 79.5, 95.0};
    std::cout << "Average: " << calculate_average(scores) << std::endl;
    return 0;
}`,
        },
        advanced: {
          notesEn: `Advanced C++: Function Templates, Lambdas & Move Semantics:
- Template functions allow generic programming across diverse data types.
- Lambda functions with capture lists for callbacks and modern functional styling.`,
          notesAr: `مستوى C++ المتقدم: القوالب العامة (Templates) ودوال Lambda ودلالات النقل:
- القوالب العامة (Function Templates) لكتابة دوال تعمل على شتى أنواع البيانات دون تكرار.
- دوال Lambda مع قوائم الالتقاط (Capture Lists) للاستدعاءات المرجعية والبرمجة الوظيفية.`,
          codeSnippet: `// C++ Advanced: Generic Template Function with Lambda Comparator
#include <iostream>
#include <vector>
#include <algorithm>

template <typename T>
T find_max(const std::vector<T>& items) {
    if (items.empty()) throw std::runtime_error("Empty collection");
    return *std::max_element(items.begin(), items.end());
}

int main() {
    std::vector<double> metrics = {14.2, 89.6, 52.1, 98.4};
    std::cout << "Max metric: " << find_max(metrics) << std::endl;
    return 0;
}`,
        },
      },
      java: {
        name: 'Java',
        basic: {
          notesEn: `In Java, functions are called methods and must reside inside classes.
- static methods can be called without instantiating the class.
- Methods declare parameter types and return type.`,
          notesAr: `في جافا تسمى الدوال بالطرائق (Methods) ويجب أن تتواجد حصراً داخل الأصناف.
- الطرائق الساكنة (static) يمكن استدعاؤها مباشرة دون إنشاء كائن من الصنف.
- تحدد الطريقة أنواع المعاملات ونوع القيمة المعادة.`,
          codeSnippet: `// Java Basic: Static Helper Methods
public class MathUtils {
    public static double calculateAverage(double[] values) {
        if (values == null || values.length == 0) return 0.0;
        double sum = 0.0;
        for (double v : values) {
            sum += v;
        }
        return sum / values.length;
    }

    public static void main(String[] args) {
        double[] examScores = {88.0, 92.5, 79.0, 95.5};
        System.out.printf("Average Score: %.2f%n", calculateAverage(examScores));
    }
}`,
        },
        advanced: {
          notesEn: `Advanced Java: Method References, Lambdas & Pure Functional Interfaces:
- Functional interfaces: java.util.function.Function, Predicate, Consumer.
- Clean composition of operations with method references (Class::method).`,
          notesAr: `مستوى جافا المتقدم: مراجع الطرائق والواجهات الوظيفية (Functional Interfaces):
- استخدام الواجهات الوظيفية الجاهزة: Function, Predicate, Consumer.
- التركيب الأنيق للعمليات باستخدام مراجع الطرائق (Class::method).`,
          codeSnippet: `// Java Advanced: Functional Interfaces and Composition
import java.util.function.Function;
import java.util.List;

public class FunctionalPipelines {
    public static void main(String[] args) {
        Function<Double, Double> addTax = amount -> amount * 1.15;
        Function<Double, String> formatCurrency = amount -> String.format("%,.2f SDG", amount);

        // Compose functions: addTax AND THEN format
        Function<Double, String> invoicePipeline = addTax.andThen(formatCurrency);

        System.out.println("Final Invoice: " + invoicePipeline.apply(2500.0));
    }
}`,
        },
      },
    },
  },
  {
    id: 'lesson-8',
    topicId: 'topic-5',
    displayOrder: 1,
    titleEn: 'Classes, Objects & Encapsulation',
    titleAr: 'الأصناف، الكائنات، وتغليف البيانات',
    arabicStatus: 'approved',
    isPublished: true,
    version: 1,
    recordingLink: 'https://meet.google.com/xyz-hemma-demo-oop1',
    notesEn: `Classes are blueprints for creating objects that combine state (attributes) and behavior (methods). Encapsulation protects an object's internal state.`,
    notesAr: `الأصناف (Classes) هي المخططات البرمجية لإنشاء الكائنات التي تجمع بين البيانات (السمات) والوظائف (الطرائق). يضمن التغليف حماية الحالة الداخلية للكائن.`,
    codeSnippet: `# Python Basic: Classes and Encapsulation
class BankAccount:
    def __init__(self, owner: str, initial_balance: float = 0.0):
        self.owner = owner
        self._balance = initial_balance

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Deposit amount must be positive.")
        self._balance += amount

    def get_balance(self) -> float:
        return self._balance

account = BankAccount("Ahmed Osman", 5000.0)
account.deposit(1500.0)
print(f"Owner: {account.owner} | Balance: {account.get_balance():,.2f} SDG")`,
    languages: {
      python: {
        name: 'Python',
        basic: {
          notesEn: `In Python, classes are defined with the class keyword.
- The __init__() method initializes instance attributes upon object creation.
- Prepending an attribute with an underscore (e.g. _balance) signals an internal (protected) field.
- Methods always accept self as their first parameter to access instance members.`,
          notesAr: `في بايثون، تُعرف الأصناف باستخدام الكلمة class.
- دالة البناء __init__() تهيئ السمات الأولية للكائن فور إنشائه في الذاكرة.
- بدء اسم المتغير بشرطة سفلية (مثل _balance) يشير اصطلاحياً إلى أنه حقل داخلي محمي لا ينبغي تعديله مباشرة.
- تستقبل الدوال داخل الصنف المعامل self كأول معامل للإشارة إلى الكائن الحالي.`,
          codeSnippet: `# Python Basic: Bank Account Class
class BankAccount:
    def __init__(self, account_holder: str, balance: float = 0.0):
        self.account_holder = account_holder
        self._balance = max(0.0, balance)

    def deposit(self, amount: float) -> bool:
        if amount > 0:
            self._balance += amount
            return True
        return False

    def withdraw(self, amount: float) -> bool:
        if 0 < amount <= self._balance:
            self._balance -= amount
            return True
        return False

    def get_balance(self) -> float:
        return self._balance

acc = BankAccount("Mona Babiker", 25000.0)
acc.deposit(5000.0)
acc.withdraw(8000.0)
print(f"Account: {acc.account_holder} | Current Balance: {acc.get_balance():,.2f} SDG")`,
        },
        advanced: {
          notesEn: `Advanced Python OOP: Properties, Dataclasses & Memory Optimization:
- The @property decorator creates managed attributes with getters, setters, and validation.
- @dataclass automatically generates boilerplate (__init__, __repr__, __eq__).
- __slots__ restricts dynamic attribute dictionary creation, drastically slashing RAM consumption in high-volume services.`,
          notesAr: `مستوى بايثون الكائني المتقدم: الخصائص (@property)، صنف البيانات (@dataclass)، وإدارة الذاكرة:
- المزخرف @property ينشئ خصائص مدارة مع دوال الفحص والتحقق من التعديل (Getters & Setters).
- المزخرف @dataclass يولد تلقائياً الدوال التأسيسية كـ __init__ و __repr__ و __eq__.
- ميزة __slots__ تمنع إنشاء قواميس السمات الديناميكية وتقلل استهلاك الذاكرة بشكل هائل للأنظمة الضخمة.`,
          codeSnippet: `# Python Advanced: Encapsulated Property & Memory-Optimized Slots
class SecureWallet:
    __slots__ = ('_owner', '_balance', '_currency')

    def __init__(self, owner: str, balance: float = 0.0, currency: str = "SDG"):
        self._owner = owner
        self._currency = currency
        self._balance = 0.0
        self.balance = balance  # Invokes the setter

    @property
    def balance(self) -> float:
        return self._balance

    @balance.setter
    def balance(self, value: float) -> None:
        if value < 0:
            raise ValueError("Balance cannot fall below zero.")
        self._balance = value

    def __repr__(self) -> str:
        return f"SecureWallet(owner='{self._owner}', balance={self._balance:,.2f} {self._currency})"

wallet = SecureWallet("Dr. Tariq", 75000.0)
print(wallet)
wallet.balance += 12500.0
print("Updated Balance:", wallet.balance)`,
        },
      },
      cpp: {
        name: 'C++',
        basic: {
          notesEn: `In C++, class members are private by default, enforcing strict encapsulation.
- Access specifiers: private for internal state, public for client interface.
- Constructors initialize state via member initializer lists.`,
          notesAr: `في لغة C++، تكون أعضاء الصنف خاصة (private) بشكل افتراضي مما يفرض تغليفاً صارماً.
- محددات الوصول: private للمتغيرات الداخلية، و public للواجهة والطرائق المتاحة للمستخدم.
- تستخدم دوال البناء (Constructors) قوائم التهيئة (Initializer Lists) لتهيئة المتغيرات بأعلى كفاءة.`,
          codeSnippet: `// C++ Basic: Class with Encapsulation
#include <iostream>
#include <string>

class BankAccount {
private:
    std::string owner_;
    double balance_;

public:
    BankAccount(const std::string& owner, double initial_balance = 0.0)
        : owner_(owner), balance_(initial_balance > 0 ? initial_balance : 0.0) {}

    void deposit(double amount) {
        if (amount > 0) balance_ += amount;
    }

    bool withdraw(double amount) {
        if (amount > 0 && amount <= balance_) {
            balance_ -= amount;
            return true;
        }
        return false;
    }

    double get_balance() const { return balance_; }
    std::string get_owner() const { return owner_; }
};

int main() {
    BankAccount acc("Hassan Ali", 18000.0);
    acc.deposit(4500.0);
    std::cout << "Holder: " << acc.get_owner() << " | Balance: " << acc.get_balance() << " SDG\\n";
    return 0;
}`,
        },
        advanced: {
          notesEn: `Advanced C++: RAII, Rule of 5 & Smart Pointers:
- RAII (Resource Acquisition Is Initialization): resources are tied to object lifetime and automatically cleaned up in the destructor.
- std::unique_ptr for exclusive, leak-free heap ownership without manual delete calls.`,
          notesAr: `مستوى C++ المتقدم: نمط RAII، قاعدة الخمسة، والمؤشرات الذكية:
- نمط RAII: ربط الموارد بدورة حياة الكائن وتحريرها حتمياً داخل دالة الهدم (Destructor).
- المؤشر الذكي std::unique_ptr لملكية الموارد الحصرية دون أي خطر لتسريب الذاكرة (Memory Leaks).`,
          codeSnippet: `// C++ Advanced: RAII & Smart Pointer Encapsulation
#include <iostream>
#include <memory>
#include <string>

class SecureLedger {
private:
    std::string ledger_id_;
    double* audit_balance_;

public:
    explicit SecureLedger(std::string id, double initial_val)
        : ledger_id_(std::move(id)), audit_balance_(new double(initial_val)) {}

    ~SecureLedger() {
        delete audit_balance_;
    }

    SecureLedger(const SecureLedger&) = delete;
    SecureLedger& operator=(const SecureLedger&) = delete;

    double get_value() const { return audit_balance_ ? *audit_balance_ : 0.0; }
};

int main() {
    auto ledger_ptr = std::make_unique<SecureLedger>("KRT-CORP-01", 125000.50);
    std::cout << "Managed Ledger Value: " << ledger_ptr->get_value() << " SDG\\n";
    return 0;
}`,
        },
      },
      java: {
        name: 'Java',
        basic: {
          notesEn: `In Java, classes encapsulate state in private fields accessed via public getter and setter methods.
- The this keyword refers to the current class instance.
- Constructors guarantee complete initialization before references escape.`,
          notesAr: `في جافا، تُغلف الحقول بوضع الكلمة private عليها ويتم الوصول إليها عبر طرائق get و set عامة.
- الكلمة المفتاحية this تشير إلى كائن الصنف الحالي.
- تضمن دوال البناء اكتمال تهيئة الكائن قبل استخدامه في البرنامج.`,
          codeSnippet: `// Java Basic: Encapsulated Bank Account
public class BankAccount {
    private final String owner;
    private double balance;

    public BankAccount(String owner, double initialBalance) {
        this.owner = owner;
        this.balance = Math.max(0.0, initialBalance);
    }

    public void deposit(double amount) {
        if (amount > 0) this.balance += amount;
    }

    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= this.balance) {
            this.balance -= amount;
            return true;
        }
        return false;
    }

    public double getBalance() { return this.balance; }
    public String getOwner() { return this.owner; }

    public static void main(String[] args) {
        BankAccount acc = new BankAccount("Sara Nour", 45000.0);
        acc.deposit(10000.0);
        System.out.printf("Owner: %s | Balance: %,.2f SDG%n", acc.getOwner(), acc.getBalance());
    }
}`,
        },
        advanced: {
          notesEn: `Advanced Java: Immutability, Records & Builder Design Pattern:
- Java records provide transparent, immutable data carriers.
- Builder pattern constructs complex domain objects with clean method chaining.`,
          notesAr: `مستوى جافا المتقدم: الكائنات غير القابلة للتعديل وسجلات Records ونمط Builder:
- سجلات جافا (Records) توفر هياكل بيانات آمنة وغير قابلة للتعديل مع دوال فحص جاهزة.
- نمط البناء (Builder Pattern) لإنشاء الكائنات المعقدة بأسلوب تسلسلي أنيق وواضح.`,
          codeSnippet: `// Java Advanced: Builder Pattern with Immutability
public class CustomerProfile {
    private final String nationalId;
    private final String fullName;
    private final boolean verified;

    private CustomerProfile(Builder builder) {
        this.nationalId = builder.nationalId;
        this.fullName = builder.fullName;
        this.verified = builder.verified;
    }

    public static class Builder {
        private final String nationalId;
        private String fullName = "";
        private boolean verified = false;

        public Builder(String nationalId) { this.nationalId = nationalId; }
        public Builder fullName(String name) { this.fullName = name; return this; }
        public Builder verified(boolean v) { this.verified = v; return this; }
        public CustomerProfile build() { return new CustomerProfile(this); }
    }

    public static void main(String[] args) {
        CustomerProfile profile = new CustomerProfile.Builder("SD-1994-0821")
            .fullName("Omer Farouk")
            .verified(true)
            .build();

        System.out.println("Constructed Profile for: " + profile.fullName);
    }
}`,
        },
      },
    },
  },
  {
    id: 'lesson-9',
    topicId: 'topic-5',
    displayOrder: 2,
    titleEn: 'Inheritance, Polymorphism & Abstract Interfaces',
    titleAr: 'الوراثة، تعدد الأشكال، والواجهات المجردة',
    arabicStatus: 'approved',
    isPublished: true,
    version: 1,
    recordingLink: 'https://meet.google.com/xyz-hemma-demo-oop2',
    notesEn: `Inheritance allows classes to inherit fields and methods from parent classes, while polymorphism allows different classes to be treated through a unified base interface.`,
    notesAr: `تتيح الوراثة (Inheritance) للأصناف اشتقاق الخصائص والطرائق من فئات أساسية، بينما يتيح تعدد الأشكال (Polymorphism) التعامل مع مختلف الأصناف عبر واجهة عامة موحدة.`,
    codeSnippet: `# Python: Inheritance and Polymorphism
class Account:
    def calculate_monthly_fee(self) -> float:
        return 100.0

class StudentAccount(Account):
    def calculate_monthly_fee(self) -> float:
        return 0.0

accounts = [Account(), StudentAccount()]
for acc in accounts:
    print(f"Fee: {acc.calculate_monthly_fee()} SDG")`,
    languages: {
      python: {
        name: 'Python',
        basic: {
          notesEn: `In Python, inheritance is declared with class Child(Parent):.
- super().__init__() invokes the parent class constructor.
- Method overriding replaces the parent implementation with specialized behavior.`,
          notesAr: `في بايثون، تتم الوراثة بكتابة الفئة الأب بين قوسين: class Child(Parent):.
- تستدعي دالة super().__init__() دالة بناء الفئة الأساسية.
- إعادة كتابة الدوال (Method Overriding) تخصص سلوك الفئة المشتقة.`,
          codeSnippet: `# Python Basic: Inheritance & Method Overriding
class Account:
    def __init__(self, owner: str, balance: float):
        self.owner = owner
        self.balance = balance

    def apply_monthly_maintenance(self) -> None:
        self.balance -= 50.0

class SavingsAccount(Account):
    def __init__(self, owner: str, balance: float, interest_rate: float = 0.05):
        super().__init__(owner, balance)
        self.interest_rate = interest_rate

    def apply_monthly_maintenance(self) -> None:
        self.balance += self.balance * (self.interest_rate / 12)

sav = SavingsAccount("Amna", 100000.0, 0.06)
sav.apply_monthly_maintenance()
print(f"Savings balance with interest: {sav.balance:,.2f} SDG")`,
        },
        advanced: {
          notesEn: `Advanced Python: Abstract Base Classes (ABC) & Multiple Inheritance:
- abc.ABC and @abstractmethod enforce interface contracts on derived classes.
- Python uses the C3 Linearization algorithm to calculate Method Resolution Order (MRO).`,
          notesAr: `مستوى بايثون المتقدم: الأصناف المجردة (ABC) والوراثة المتعددة:
- استخدام abc.ABC والمزخرف @abstractmethod لفرض عقود برمجية إلزامية على الفئات المشتقة.
- خوارزمية C3 Linearization لحساب ترتيب استدعاء الدوال في الوراثة المتعددة (MRO).`,
          codeSnippet: `# Python Advanced: Abstract Base Classes (Enforcing Interfaces)
from abc import ABC, abstractmethod

class PaymentGateway(ABC):
    @abstractmethod
    def process_transaction(self, amount: float) -> str:
        pass

class BankakAdapter(PaymentGateway):
    def process_transaction(self, amount: float) -> str:
        return f"[BOK Bankak] Successfully transferred {amount:,.2f} SDG"

class FawryAdapter(PaymentGateway):
    def process_transaction(self, amount: float) -> str:
        return f"[Fawry Sudan] Card charge completed for {amount:,.2f} SDG"

gateways = [BankakAdapter(), FawryAdapter()]
for gw in gateways:
    print(gw.process_transaction(7500.0))`,
        },
      },
      cpp: {
        name: 'C++',
        basic: {
          notesEn: `In C++, derived classes inherit with public BaseClass syntax.
- The virtual keyword enables dynamic polymorphism via vtables.
- The override specifier ensures the compiler checks that a base method is actually being overridden.`,
          notesAr: `في C++، يتم اشتقاق الأصناف باستخدام صيغة : public BaseClass.
- الكلمة المفتاحية virtual تفعل تعدد الأشكال الديناميكي عبر جداول الدوال الافتراضية (vtable).
- الكلمة override تجعل المترجم يتحقق من صحة مطابقة توقيع الدالة مع الفئة الأساسية.`,
          codeSnippet: `// C++ Basic: Inheritance & Virtual Functions
#include <iostream>
#include <vector>
#include <memory>

class Account {
public:
    virtual ~Account() = default;
    virtual double calculate_fee() const { return 100.0; }
};

class StudentAccount : public Account {
public:
    double calculate_fee() const override { return 0.0; }
};

int main() {
    std::vector<std::unique_ptr<Account>> accounts;
    accounts.push_back(std::make_unique<Account>());
    accounts.push_back(std::make_unique<StudentAccount>());

    for (const auto& acc : accounts) {
        std::cout << "Fee: " << acc->calculate_fee() << " SDG\\n";
    }
    return 0;
}`,
        },
        advanced: {
          notesEn: `Advanced C++: Pure Virtual Interfaces & Virtual Destructors:
- Pure virtual functions (= 0) create pure abstract interfaces without implementation.
- Virtual destructors prevent undefined behavior and memory leaks when deleting derived objects through base pointers.`,
          notesAr: `مستوى C++ المتقدم: الواجهات المجردة الصافية ودوال الهدم الافتراضية:
- الدوال الافتراضية الصافية (= 0) تنشئ واجهات برمجية مجردة بالكامل بدون أي تطبيق.
- دالة الهدم الافتراضية (Virtual Destructor) تمنع تسريب الذاكرة عند حذف الكائنات المشتقة عبر مؤشر الفئة الأساسية.`,
          codeSnippet: `// C++ Advanced: Pure Virtual Interface & Polymorphic Engine
#include <iostream>
#include <memory>
#include <string>

class ITelemetryService {
public:
    virtual ~ITelemetryService() = default;
    virtual void log_metric(const std::string& key, double value) = 0;
};

class CloudTelemetry : public ITelemetryService {
public:
    void log_metric(const std::string& key, double value) override {
        std::cout << "[Cloud Hub] Ingested metric: " << key << " = " << value << "\\n";
    }
};

int main() {
    std::unique_ptr<ITelemetryService> service = std::make_unique<CloudTelemetry>();
    service->log_metric("AIR_TEMP_KHARTOUM", 39.8);
    return 0;
}`,
        },
      },
      java: {
        name: 'Java',
        basic: {
          notesEn: `In Java, inheritance uses the extends keyword for single-class inheritance and implements for interfaces.
- @Override annotation ensures compiler safety.
- All non-static, non-private methods in Java are virtual by default.`,
          notesAr: `في جافا، تُستخدم الكلمة extends لوراثة فئة واحدة، والكلمة implements لتطبيق الواجهات.
- الوسم @Override يضمن سلامة إعادة كتابة الدوال ويحمي من الأخطاء الإملائية.
- كافة الدوال غير الساكنة وغير الخاصة في جافا تعتبر افتراضية (Virtual) تلقائياً.`,
          codeSnippet: `// Java Basic: Class Inheritance & Polymorphism
class Account {
    public double getMonthlyFee() { return 100.0; }
}

class StudentAccount extends Account {
    @Override
    public double getMonthlyFee() { return 0.0; }
}

public class InheritanceDemo {
    public static void main(String[] args) {
        Account[] accounts = { new Account(), new StudentAccount() };
        for (Account acc : accounts) {
            System.out.printf("Fee: %.2f SDG%n", acc.getMonthlyFee());
        }
    }
}`,
        },
        advanced: {
          notesEn: `Advanced Java: Interfaces with Default Methods & Sealed Hierarchies:
- Modern Java interfaces support default and static methods.
- Sealed classes (sealed ... permits) restrict which subclasses can extend a class, enabling exhaustive compiler checks.`,
          notesAr: `مستوى جافا المتقدم: الواجهات ذات الدوال الافتراضية والفئات المختومة (Sealed Classes):
- تدعم واجهات جافا الحديثة كتابة دوال افتراضية (default) وساكنة داخل الواجهة.
- الفئات المختومة (Sealed Classes عبر الكلمة sealed و permits) تحدد بدقة الأصناف المسموح لها بالوراثة.`,
          codeSnippet: `// Java Advanced: Sealed Class Hierarchy (Java 21)
sealed interface NotificationService permits EmailNotifier, SmsNotifier {
    void dispatch(String message);
}

final class EmailNotifier implements NotificationService {
    public void dispatch(String msg) {
        System.out.println("[SMTP Email] " + msg);
    }
}

final class SmsNotifier implements NotificationService {
    public void dispatch(String msg) {
        System.out.println("[Sudatel SMS Gateway] " + msg);
    }
}

public class NotificationDemo {
    public static void main(String[] args) {
        NotificationService service = new SmsNotifier();
        service.dispatch("Emergency weather update for River Nile State.");
    }
}`,
        },
      },
    },
  },
  {
    id: 'lesson-10',
    topicId: 'topic-6',
    displayOrder: 1,
    titleEn: 'Data Collections, File Streams & JSON Persistence',
    titleAr: 'هياكل البيانات، تدفق الملفات، وتسلسل بيانات JSON',
    arabicStatus: 'approved',
    isPublished: true,
    version: 1,
    recordingLink: 'https://meet.google.com/xyz-hemma-demo-files',
    notesEn: `Storing data in collections and persisting it to files on disk ensures application state survives program restarts.`,
    notesAr: `تخزين البيانات في الهياكل البرمجية وحفظها في ملفات على القرص الصلب يضمن بقاء حالة التطبيق حتى بعد إعادة تشغيل البرنامج.`,
    codeSnippet: `# Python: File I/O and JSON
import json

students = {"ahmed": 92, "fatima": 98, "khalid": 84}
with open("grades.json", "w") as f:
    json.dump(students, f, indent=2)

print("Saved database successfully.")`,
    languages: {
      python: {
        name: 'Python',
        basic: {
          notesEn: `Python provides built-in dictionaries (dict) and lists for structured collections.
- The with open('filename', 'mode') statement guarantees files are safely closed.
- Modes: 'r' for reading, 'w' for writing, 'a' for appending.`,
          notesAr: `توفر بايثون القواميس (dict) والقوائم (list) لإدارة المجموعات المنظمة.
- تضمن جملة with open('filename', 'mode') إغلاق الملفات بأمان بعد الانتهاء منها.
- الأنماط: 'r' للقراءة، 'w' للكتابة والإنشاء، و 'a' للإضافة في نهاية الملف.`,
          codeSnippet: `# Python Basic: Dictionary Collections & Text File I/O
grades = {
    "Ahmed Osman": 88.5,
    "Fatima Elamin": 94.0,
    "Khalid Omer": 76.5
}

with open("student_records.txt", "w", encoding="utf-8") as file:
    for student, score in grades.items():
        file.write(f"{student},{score}\\n")

print("Loaded Records from Disk:")
with open("student_records.txt", "r", encoding="utf-8") as file:
    for line in file:
        name, sc = line.strip().split(",")
        print(f"• {name}: {sc} marks")`,
        },
        advanced: {
          notesEn: `Advanced Python: JSON Serialization & High-Performance Collections:
- json.dumps() and json.loads() for structured API persistence.
- collections.defaultdict to avoid KeyError exceptions.
- Custom context managers with __enter__ and __exit__.`,
          notesAr: `مستوى بايثون المتقدم: تسلسل JSON وهياكل البيانات المتخصصة:
- استخدام مكتبة json لتحويل الكائنات إلى صيغة JSON وتخزينها واسترجاعها بدقة.
- كائن collections.defaultdict لتجنب أخطاء المفاتيح المفقودة (KeyError).
- بناء مديري سياق مخصصين عبر الدوال السحرية __enter__ و __exit__.`,
          codeSnippet: `# Python Advanced: Robust JSON Persistence
import json

database_file = "academic_ledger.json"

payload = {
    "module": "SAIR AI Track 2026",
    "students": [
        {"id": "usr-1", "name": "Ahmed", "scores": [90, 85, 95]},
        {"id": "usr-2", "name": "Fatima", "scores": [98, 92, 100]}
    ]
}

with open(database_file, "w", encoding="utf-8") as f:
    json.dump(payload, f, indent=2)

with open(database_file, "r", encoding="utf-8") as f:
    loaded_data = json.load(f)

for st in loaded_data["students"]:
    avg = sum(st["scores"]) / len(st["scores"])
    print(f"Student: {st['name']} | Average: {avg:.1f}%")`,
        },
      },
      cpp: {
        name: 'C++',
        basic: {
          notesEn: `C++ standard library provides std::map (balanced binary tree) and file streams (#include <fstream>).
- std::ofstream writes files; std::ifstream reads files.
- RAII automatically closes streams when they go out of scope.`,
          notesAr: `توفر مكتبة C++ القياسية خريطة std::map ومسارات تدفق الملفات عبر <fstream>.
- std::ofstream للكتابة في الملفات، و std::ifstream للقراءة منها.
- مبدأ RAII يغلق مسارات الملفات تلقائياً بمجرد انتهاء نطاق المتغير.`,
          codeSnippet: `// C++ Basic: std::map and File Stream I/O
#include <iostream>
#include <fstream>
#include <map>
#include <string>

int main() {
    std::map<std::string, double> student_gpa = {
        {"Ahmed", 3.85},
        {"Fatima", 3.96},
        {"Khalid", 3.20}
    };

    std::ofstream outfile("grades.txt");
    for (const auto& [name, gpa] : student_gpa) {
        outfile << name << " " << gpa << "\\n";
    }
    outfile.close();

    std::ifstream infile("grades.txt");
    std::string name;
    double gpa;
    while (infile >> name >> gpa) {
        std::cout << "Read Record: " << name << " -> GPA: " << gpa << "\\n";
    }
    return 0;
}`,
        },
        advanced: {
          notesEn: `Advanced C++: std::unordered_map (Hash Table) & Fast Binary Serialization:
- std::unordered_map provides O(1) average lookup.
- Fast binary streaming with reinterpret_cast and stream.write() for raw bytes.`,
          notesAr: `مستوى C++ المتقدم: جداول التجزئة std::unordered_map والتخزين الثنائي المباشر:
- جدول التجزئة std::unordered_map يمنح زمناً ثابتاً O(1) في البحث.
- الكتابة الثنائية المباشرة (Binary Streaming) لتخزين البيانات الخام على القرص بأعلى سرعة ممكنة.`,
          codeSnippet: `// C++ Advanced: Fast Binary File Persistence
#include <iostream>
#include <fstream>
#include <unordered_map>

struct SystemConfig {
    int max_connections;
    double timeout_seconds;
};

int main() {
    SystemConfig cfg{500, 30.5};

    std::ofstream out("config.bin", std::ios::binary);
    out.write(reinterpret_cast<const char*>(&cfg), sizeof(SystemConfig));
    out.close();

    SystemConfig loaded{};
    std::ifstream in("config.bin", std::ios::binary);
    in.read(reinterpret_cast<char*>(&loaded), sizeof(SystemConfig));

    std::cout << "Loaded Config: max_connections=" << loaded.max_connections 
              << ", timeout=" << loaded.timeout_seconds << "s\\n";
    return 0;
}`,
        },
      },
      java: {
        name: 'Java',
        basic: {
          notesEn: `Java Collections Framework provides HashMap, ArrayList, and HashSet.
- java.nio.file.Files provides simple utility methods to write and read text files.`,
          notesAr: `يوفر إطار مجموعات جافا كلاً من HashMap و ArrayList و HashSet.
- حزمة java.nio.file.Files توفر دوالاً حديثة ومريحة لقراءة وكتابة ملفات النصوص.`,
          codeSnippet: `// Java Basic: HashMap & Files Utility
import java.util.HashMap;
import java.util.Map;
import java.nio.file.Files;
import java.nio.file.Path;
import java.io.IOException;

public class BasicFileDemo {
    public static void main(String[] args) throws IOException {
        Map<String, Double> grades = new HashMap<>();
        grades.put("Ahmed", 88.0);
        grades.put("Fatima", 95.5);

        Path filePath = Path.of("students.txt");
        StringBuilder sb = new StringBuilder();
        for (var entry : grades.entrySet()) {
            sb.append(entry.getKey()).append(":").append(entry.getValue()).append("\\n");
        }

        Files.writeString(filePath, sb.toString());
        System.out.println("Saved records:\\n" + Files.readString(filePath));
    }
}`,
        },
        advanced: {
          notesEn: `Advanced Java: Concurrent Collections & Try-with-Resources Streaming:
- ConcurrentHashMap allows lock-free concurrent reads and partitioned writes across threads.
- BufferedReader and BufferedWriter with try-with-resources prevent descriptor leaks.`,
          notesAr: `مستوى جافا المتقدم: المجموعات المتزامنة وقراءة التدفق الآمنة:
- جدول ConcurrentHashMap يتيح القراءة المتزامنة دون أقفال والكتابة المجزأة عبر خيوط المعالجة.
- استخدام BufferedReader مع try-with-resources لضمان تحرير المقابض ومنع تسريب الذاكرة.`,
          codeSnippet: `// Java Advanced: ConcurrentHashMap & Safe Streaming
import java.util.concurrent.ConcurrentHashMap;
import java.io.BufferedWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.io.IOException;

public class AdvancedPersistence {
    public static void main(String[] args) {
        ConcurrentHashMap<String, Integer> cache = new ConcurrentHashMap<>();
        cache.put("SESSION_TOKEN_1", 200);
        cache.put("SESSION_TOKEN_2", 401);

        Path logPath = Path.of("session_audit.log");

        try (BufferedWriter writer = Files.newBufferedWriter(logPath)) {
            for (var entry : cache.entrySet()) {
                writer.write(entry.getKey() + "=" + entry.getValue());
                writer.newLine();
            }
            System.out.println("Audit log flushed to disk safely.");
        } catch (IOException e) {
            System.err.println("File stream error: " + e.getMessage());
        }
    }
}`,
        },
      },
    },
  },
  {
    id: 'lesson-6',
    topicId: 'topic-4',
    displayOrder: 1,
    titleEn: 'NumPy Vectorization & High-Performance Data Processing',
    titleAr: 'المعالجة الشعاعية والبيانات عالية الأداء عبر NumPy (مسار SAIR)',
    arabicStatus: 'approved',
    isPublished: true,
    version: 1,
    recordingLink: 'https://meet.google.com/xyz-sair-ai-track-1',
    notesEn: `In this lesson curated with the Sudanese Artificial Intelligence Researchers (SAIR) community, you learn vector operations, tensor manipulation, and high-performance numerical computing.`,
    notesAr: `في هذا الدرس المعد بالتعاون مع مجتمع الباحثين السودانيين في الذكاء الاصطناعي (SAIR)، ستتعلم العمليات الشعاعية، معالجة الموترات التنسورية، والحساب العددي عالي الكفاءة.`,
    codeSnippet: `import numpy as np

# Vectorized operations vs slow Python loops
rainfall_mm = np.array([12.5, 34.0, 0.0, 8.2, 45.1, 2.0, 18.9])
print(f"Mean Rainfall: {np.mean(rainfall_mm):.2f} mm")
print(f"Standard Deviation: {np.std(rainfall_mm):.2f}")`,
    languages: {
      python: {
        name: 'Python',
        basic: {
          notesEn: `NumPy (Numerical Python) is the foundation of the AI and scientific computing stack.
- np.array creates homogeneous n-dimensional arrays.
- Array broadcasting allows arithmetic operations on arrays of different compatible shapes without manual copying.
- Fundamental functions: np.mean(), np.std(), np.sum(), np.dot(), np.reshape().`,
          notesAr: `تعتبر مكتبة NumPy حجر الأساس لحزمة الذكاء الاصطناعي والحوسبة العلمية في بايثون.
- تنشئ np.array مصفوفات متجانسة ومتعددة الأبعاد في الذاكرة.
- تتيح ميزة البث (Broadcasting) إجراء العمليات الحسابية بين مصفوفات ذات أبعاد متوافقة تلقائياً دون نسخ الذاكرة.
- الدوال الأساسية: np.mean(), np.std(), np.sum(), np.dot(), np.reshape().`,
          codeSnippet: `# Python (NumPy Basic): Array Vectorization
import numpy as np

# Agricultural rainfall recordings across 7 Sudanese meteorological stations
stations_rainfall = np.array([12.5, 34.0, 0.0, 8.2, 45.1, 2.0, 18.9])

# Vectorized arithmetic (applied to every element simultaneously)
rainfall_inches = stations_rainfall * 0.0393701

print("Rainfall in inches:", np.round(rainfall_inches, 2))
print(f"Max Station Reading: {np.max(stations_rainfall)} mm")
print(f"Drought Days (Rain == 0): {np.sum(stations_rainfall == 0)}")`,
        },
        advanced: {
          notesEn: `Advanced NumPy (SAIR AI Foundation): Matrix Factorization & Tensor Operations:
- Multidimensional tensor reshaping and dot products for neural network weight projections.
- Masked arrays and boolean indexing for filtering large-scale sensor anomalies.
- Linear algebra routines (np.linalg) for computing eigenvalues and covariance matrices.`,
          notesAr: `مستوى NumPy المتقدم (تأسيس مسار أبحاث SAIR): ضرب المصفوفات والموترات التنسورية:
- تعديل أبعاد المصفوفات (Reshape) والضرب الماتريكسي (Dot Product) لإسقاط أوزان الشبكات العصبية.
- الفهرسة المنطقية (Boolean Masking) لتصفية البيانات الشاذة في حساسات الطقس والتربة.
- دوال الجبر الخطي (np.linalg) لحساب مصفوفات التباين والترابط الرياضي.`,
          codeSnippet: `# Python (NumPy Advanced): Neural Weight Projection & Covariance
import numpy as np

# Simulated agricultural feature matrix: [Batch Size = 3, Features = 4]
# Features: [Soil Moisture %, Temp C, Nitrogen Level, Sunlight Hours]
X = np.array([
    [32.0, 38.5, 140.0, 9.2],
    [18.5, 42.1, 95.0, 11.0],
    [45.0, 29.8, 180.0, 7.5]
])

# Random projection weights for ML embedding layer: [Features = 4, Latent Units = 2]
np.random.seed(42)
W = np.random.randn(4, 2)
bias = np.array([0.1, -0.2])

# Forward layer computation: Y = X * W + b
embeddings = np.dot(X, W) + bias

print("Latent Feature Projections:\\n", embeddings)
print("Covariance Matrix Shape:", np.cov(X.T).shape)`,
        },
      },
      cpp: {
        name: 'C++',
        basic: {
          notesEn: `High-Performance Numeric Computing in C++:
- Utilizing contiguous memory buffers with std::vector<double>.
- Memory layout considerations (Cache Lines and spatial locality).`,
          notesAr: `الحوسبة العددية عالية الأداء في لغة C++:
- استخدام المخازن المؤقتة المتجاورة في الذاكرة عبر std::vector<double>.
- اعتبارات تنظيم الذاكرة (Cache Lines) والتقارب المكاني للبيانات لرفع سرعة المعالجة.`,
          codeSnippet: `// C++ Basic: Vectorized Numerical Accumulation
#include <iostream>
#include <vector>
#include <numeric>
#include <cmath>

int main() {
    std::vector<double> rainfall = {12.5, 34.0, 0.0, 8.2, 45.1, 2.0, 18.9};

    double sum = std::accumulate(rainfall.begin(), rainfall.end(), 0.0);
    double mean = sum / rainfall.size();

    double sq_sum = 0.0;
    for (double val : rainfall) {
        sq_sum += (val - mean) * (val - mean);
    }
    double std_dev = std::sqrt(sq_sum / rainfall.size());

    std::cout << "Mean Rainfall: " << mean << " mm\\n";
    std::cout << "Std Deviation: " << std_dev << " mm\\n";
    return 0;
}`,
        },
        advanced: {
          notesEn: `Advanced C++: SIMD Vectorization & Cache-Optimized Matrix Multiplication:
- Writing loop structures that allow compiler auto-vectorization (AVX2 / AVX-512).
- Flat 1D index mapping for 2D matrix multiplication to eliminate pointer indirection.`,
          notesAr: `مستوى C++ المتقدم: تعليمات SIMD وتحسين ضرب المصفوفات للذاكرة المخبئية:
- كتابة حلقات تكرار قابلة للتجميع الشعاعي التلقائي (AVX2 / AVX-512) بواسطة المترجم.
- تمثيل المصفوفات ثنائية الأبعاد كمصفوفة أحادية مسطحة (Flat 1D) لتفادي قفزات المؤشرات في الذاكرة.`,
          codeSnippet: `// C++ Advanced: Flat Matrix Multiplication (Cache Friendly)
#include <iostream>
#include <vector>

void matmul(const double* A, const double* B, double* C, int N, int K, int M) {
    for (int i = 0; i < N; ++i) {
        for (int k = 0; k < K; ++k) {
            for (int j = 0; j < M; ++j) {
                C[i * M + j] += A[i * K + k] * B[k * M + j];
            }
        }
    }
}

int main() {
    // 2x2 Matrix Multiplication Demo
    std::vector<double> A = {1.0, 2.0, 3.0, 4.0};
    std::vector<double> B = {2.0, 0.0, 1.0, 2.0};
    std::vector<double> C(4, 0.0);

    matmul(A.data(), B.data(), C.data(), 2, 2, 2);
    std::cout << "Result C[0][0]: " << C[0] << " | C[1][1]: " << C[3] << std::endl;
    return 0;
}`,
        },
      },
      java: {
        name: 'Java',
        basic: {
          notesEn: `Numerical Processing in Java:
- Working with primitive double[] arrays for maximum cache locality without boxing overhead.
- java.lang.Math utility methods for statistical formulas.`,
          notesAr: `المعالجة العددية في لغة جافا:
- التعامل مع مصفوفات الأعداد الأولية double[] للحفاظ على التقارب المكاني في الذاكرة وتجنب تكلفة التغليف (Autoboxing).
- استخدام حزمة java.lang.Math لتطبيق المعادلات الإحصائية.`,
          codeSnippet: `// Java Basic: Primitive Array Statistics
public class NumericalStats {
    public static void main(String[] args) {
        double[] readings = {12.5, 34.0, 0.0, 8.2, 45.1, 2.0, 18.9};

        double sum = 0.0;
        for (double val : readings) sum += val;
        double mean = sum / readings.length;

        double variance = 0.0;
        for (double val : readings) variance += Math.pow(val - mean, 2);
        double stdDev = Math.sqrt(variance / readings.length);

        System.out.printf("Mean: %.2f mm | StdDev: %.2f%n", mean, stdDev);
    }
}`,
        },
        advanced: {
          notesEn: `Advanced Java: Vector API (Project Panama) & Matrix Compute:
- Vector API (incubating in modern JDKs) provides direct hardware SIMD intrinsics.
- Multi-threaded batch data transformations using ForkJoinPool.`,
          notesAr: `مستوى جافا المتقدم: واجهة Vector API ومعالجة المصفوفات متعددة الخيوط:
- استغلال واجهة Vector API الحديثة للوصول المباشر إلى تعليمات المعالج الشعاعية (Hardware SIMD).
- تحويل دفعات البيانات عبر خيوط المعالجة المتعددة باستخدام ForkJoinPool.`,
          codeSnippet: `// Java Advanced: Multi-Threaded Dot Product
import java.util.stream.IntStream;

public class ParallelDotProduct {
    public static double compute(double[] a, double[] b) {
        if (a.length != b.length) throw new IllegalArgumentException("Vector length mismatch");
        return IntStream.range(0, a.length)
                        .parallel()
                        .mapToDouble(i -> a[i] * b[i])
                        .sum();
    }

    public static void main(String[] args) {
        double[] weights = {0.8, -0.4, 1.2, 0.5};
        double[] inputs  = {1.5,  2.0, 0.5, 3.0};

        System.out.println("Dot Product: " + compute(weights, inputs));
    }
}`,
        },
      },
    },
  },
  {
    id: 'lesson-7',
    topicId: 'topic-4',
    displayOrder: 2,
    titleEn: 'Pandas & Machine Learning Foundations (SAIR Research Track)',
    titleAr: 'تحليل البيانات وتعلم الآلة التأسيسي (مسار بحوث SAIR)',
    arabicStatus: 'approved',
    isPublished: true,
    version: 1,
    recordingLink: 'https://meet.google.com/xyz-sair-ai-track-2',
    notesEn: `Learn tabular data engineering with Pandas and train classification models for practical real-world problem solving.`,
    notesAr: `تعلم هندسة البيانات الجدولية باستخدام مكتبة Pandas وتدريب نماذج التصنيف الآلي لحل المشكلات الواقعية.`,
    codeSnippet: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

# Load dataset and prepare ML pipeline
df = pd.DataFrame({
    'moisture': [35, 12, 42, 18, 55, 10],
    'temp': [28, 43, 31, 39, 27, 45],
    'healthy_crop': [1, 0, 1, 0, 1, 0]
})
print("Dataset Summary:\\n", df.describe())`,
    languages: {
      python: {
        name: 'Python',
        basic: {
          notesEn: `Pandas is the leading library for data wrangling and tabular dataset exploration:
- pd.DataFrame and pd.Series represent tables and columns.
- Methods: .head(), .info(), .describe(), .groupby(), .fillna(), .dropna().
- Filtering rows with boolean indexing: df[df['temp'] > 40].`,
          notesAr: `تعتبر Pandas المكتبة الرائدة عالمياً لإدارة وتحليل البيانات الجدولية:
- يمثل DataFrame الجداول، بينما يمثل Series الأعمدة الفردية.
- دوال الفحص الأساسية: .head(), .info(), .describe(), .groupby(), .fillna(), .dropna().
- تصفية الصفوف بالشروط المنطقية: df[df['temp'] > 40].`,
          codeSnippet: `# Python (Pandas Basic): Agricultural Dataset Cleaning
import pandas as pd

data = {
    'Region': ['Gezira', 'Gadarif', 'Nile River', 'Kassala', 'Blue Nile'],
    'Crop': ['Sorghum', 'Sesame', 'Wheat', 'Onions', 'Cotton'],
    'Yield_Tons': [420.5, 310.2, 580.0, None, 490.8],
    'Rainfall_mm': [380, 520, 110, 240, 680]
}

df = pd.DataFrame(data)

# Impute missing values with column median
median_yield = df['Yield_Tons'].median()
df['Yield_Tons'] = df['Yield_Tons'].fillna(median_yield)

print("Cleaned Dataset:\\n", df)
print(f"\\nAverage Crop Yield: {df['Yield_Tons'].mean():.2f} tons")`,
        },
        advanced: {
          notesEn: `Advanced Machine Learning (SAIR Research Pipeline):
- Feature engineering and standard scaling (StandardScaler).
- Train/Test split to avoid data leakage and prevent overfitting.
- Training a Logistic Regression / Random Forest model with Scikit-learn.
- Evaluating model metrics: Accuracy, Precision, Recall, Confusion Matrix, and F1-Score.`,
          notesAr: `مستوى تعلم الآلة المتقدم (مسار بحوث مجتمع SAIR للذكاء الاصطناعي):
- هندسة الميزات والمعايرة القياسية (StandardScaler).
- تقسيم البيانات لمجموعتي تدريب واختبار (Train/Test Split) لمنع تسريب البيانات وضمان التعميم.
- تدريب نموذج تصنيف (Logistic Regression أو Random Forest) عبر مكتبة Scikit-Learn.
- قياس دقة النموذج: Accuracy, Precision, Recall, مصفوفة الالتباس (Confusion Matrix), ومعامل F1-Score.`,
          codeSnippet: `# Python (Scikit-Learn Advanced): End-to-End Crop Health Classifier
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

# 1. Synthesize agricultural health telemetry
np.random.seed(42)
N = 200
moisture = np.random.uniform(10, 60, N)
temp = np.random.uniform(20, 48, N)
# Healthy crop (1) requires moisture > 25 and temp < 42
labels = ((moisture > 25) & (temp < 42)).astype(int)

df = pd.DataFrame({'moisture': moisture, 'temperature': temp, 'label': labels})

# 2. Train / Test Split (80% train, 20% test)
X = df[['moisture', 'temperature']]
y = df['label']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Feature Scaling & Model Training
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

model = LogisticRegression()
model.fit(X_train_scaled, y_train)

# 4. Evaluation
preds = model.predict(X_test_scaled)
print(f"SAIR Model Accuracy: {accuracy_score(y_test, preds) * 100:.1f}%")
print("\\nClassification Metrics:\\n", classification_report(y_test, preds))`,
        },
      },
      cpp: {
        name: 'C++',
        basic: {
          notesEn: `Tabular Record Structures in C++:
- Using struct or class to represent rows of heterogeneous attributes.
- Reading and parsing CSV data into vectors of records.`,
          notesAr: `هياكل السجلات الجدولية في C++:
- استخدام struct أو class لتمثيل صفوف البيانات غير المتجانسة.
- قراءة وتجزئة ملفات CSV وتخزينها في قوائم ديناميكية من السجلات.`,
          codeSnippet: `// C++ Basic: Tabular Record Data Representation
#include <iostream>
#include <vector>
#include <string>

struct CropRecord {
    std::string region;
    double yield_tons;
    int rainfall_mm;
};

int main() {
    std::vector<CropRecord> dataset = {
        {"Gezira", 420.5, 380},
        {"Gadarif", 310.2, 520},
        {"Nile River", 580.0, 110}
    };

    double total_yield = 0.0;
    for (const auto& rec : dataset) {
        total_yield += rec.yield_tons;
        std::cout << "Region: " << rec.region << " | Yield: " << rec.yield_tons << " t\\n";
    }

    std::cout << "Total Production: " << total_yield << " tons\\n";
    return 0;
}`,
        },
        advanced: {
          notesEn: `Advanced C++: Building a Decision Stump / Logistic Classifier from Scratch:
- Implementing numerical gradient descent in C++ without third-party frameworks.
- Direct sigmoid activation computation and binary cross-entropy loss tracking.`,
          notesAr: `مستوى C++ المتقدم: بناء خوارزمية الانحدار اللوجستي من الصفر:
- برمجة خوارزمية النزول التدريجي (Gradient Descent) بلغة C++ مباشرة دون أطر عمل خارجية.
- حساب دالة التنشيط السيجمويدية (Sigmoid) ومتابعة دالة التكلفة (Cross-Entropy Loss).`,
          codeSnippet: `// C++ Advanced: Lightweight Logistic Regression Classifier
#include <iostream>
#include <vector>
#include <cmath>

double sigmoid(double z) {
    return 1.0 / (1.0 + std::exp(-z));
}

int main() {
    // Feature: normalized soil moisture -> Target: 1 (healthy), 0 (wilted)
    std::vector<double> x = {0.1, 0.2, 0.7, 0.8, 0.9};
    std::vector<int> y = {0, 0, 1, 1, 1};

    double weight = 0.0;
    double bias = 0.0;
    double learning_rate = 0.1;

    for (int epoch = 0; epoch < 500; ++epoch) {
        double dw = 0.0, db = 0.0;
        for (size_t i = 0; i < x.size(); ++i) {
            double pred = sigmoid(weight * x[i] + bias);
            double err = pred - y[i];
            dw += err * x[i];
            db += err;
        }
        weight -= learning_rate * (dw / x.size());
        bias -= learning_rate * (db / x.size());
    }

    std::cout << "Trained Weight: " << weight << " | Bias: " << bias << std::endl;
    std::cout << "Prediction for 0.75 moisture: " << sigmoid(weight * 0.75 + bias) << std::endl;
    return 0;
}`,
        },
      },
      java: {
        name: 'Java',
        basic: {
          notesEn: `Data Modeling in Java:
- Creating Java records (Java 16+) for immutable, clean tabular row representations.
- Aggregating metrics with Java Stream collectors.`,
          notesAr: `نمذجة البيانات في لغة جافا:
- استخدام سجلات جافا الحديثة (Java Records) لتمثيل صفوف البيانات الجدولية بشكل نظيف وآمن.
- تجميع وحساب المتوسطات عبر جامعات التدفق (Stream Collectors).`,
          codeSnippet: `// Java Basic: Tabular Java Records
import java.util.List;

public class CropDataAnalysis {
    public record CropEntry(String region, double yieldTons, int rainfallMm) {}

    public static void main(String[] args) {
        List<CropEntry> records = List.of(
            new CropEntry("Gezira", 420.5, 380),
            new CropEntry("Gadarif", 310.2, 520),
            new CropEntry("Nile River", 580.0, 110)
        );

        double totalYield = records.stream()
                                   .mapToDouble(CropEntry::yieldTons)
                                   .sum();

        System.out.printf("Total Agricultural Yield: %,.2f tons%n", totalYield);
    }
}`,
        },
        advanced: {
          notesEn: `Advanced Java: Machine Learning Classification Pipeline with Tribuo/Weka Concepts:
- Normalization pipelines and decision evaluation.
- Confusion matrix and F1 metric calculation in clean object-oriented architecture.`,
          notesAr: `مستوى جافا المتقدم: خط أنابيب تصنيف تعلم الآلة وفق المفاهيم الكائنية:
- بناء معالجات القياس والتحويل العددي (Normalization).
- حساب مصفوفة الالتباس ومعامل F1-Score وفق هيكلية برمجية نظيفة وقابلة للتوسع.`,
          codeSnippet: `// Java Advanced: Confusion Matrix and Precision/Recall Evaluator
public class ModelEvaluator {
    public static void main(String[] args) {
        int[] actual    = {1, 0, 1, 1, 0, 1, 0, 0, 1, 1};
        int[] predicted = {1, 0, 1, 0, 0, 1, 0, 1, 1, 1};

        int tp = 0, fp = 0, fn = 0, tn = 0;
        for (int i = 0; i < actual.length; i++) {
            if (actual[i] == 1 && predicted[i] == 1) tp++;
            else if (actual[i] == 0 && predicted[i] == 1) fp++;
            else if (actual[i] == 1 && predicted[i] == 0) fn++;
            else tn++;
        }

        double precision = (double) tp / (tp + fp);
        double recall = (double) tp / (tp + fn);
        double f1 = 2 * (precision * recall) / (precision + recall);

        System.out.printf("Precision: %.2f | Recall: %.2f | F1-Score: %.2f%n", precision, recall, f1);
    }
}`,
        },
      },
    },
  },
];

export const INITIAL_SUBMISSIONS = [
  {
    id: 'sub-101',
    topicId: 'topic-1',
    assignmentTitleEn: 'Module 1 Project: Student Expense & Currency Calculator',
    assignmentTitleAr: 'مشروع الوحدة الأولى: حاسبة مصروفات الطالب وتحويل العملات',
    learnerId: 'usr-learner-1',
    learnerName: 'Ahmed Osman',
    githubLink: 'https://github.com/ahmed-osman/hemma-python-intro',
    explanation: 'I implemented the expense tracking with float precision, validated user input against negative numbers, and formatted SDG currency output with f-strings.',
    attemptNo: 1,
    status: 'revision_requested', // 'submitted' | 'under_review' | 'feedback_given' | 'revision_requested' | 'escalated' | 'complete'
    submittedAt: '2026-10-28T14:20:00Z',
    assignedMentorId: 'usr-mentor-1',
    feedbacks: [
      {
        author: 'Sarah Ibrahim',
        text: 'Good start on the student expense calculation! Please add input validation to reject negative values and non-numeric inputs. Also, include 3 test cases in your README file.',
        date: '2026-10-30T09:15:00Z',
      },
    ],
  },
  {
    id: 'sub-102',
    topicId: 'topic-1',
    assignmentTitleEn: 'Module 1 Project: Student Expense & Currency Calculator',
    assignmentTitleAr: 'مشروع الوحدة الأولى: حاسبة مصروفات الطالب وتحويل العملات',
    learnerId: 'usr-learner-2',
    learnerName: 'Fatima Elamin',
    githubLink: 'https://github.com/fatima-elamin/student-expense-app',
    explanation: 'Basic CLI calculator with currency converter SDG/USD. Includes interactive prompt loop.',
    attemptNo: 1,
    status: 'submitted',
    submittedAt: '2026-11-01T10:15:00Z',
    assignedMentorId: null,
    feedbacks: [],
  },
  {
    id: 'sub-103',
    topicId: 'topic-2',
    assignmentTitleEn: 'Module 2 Project: Grade Evaluation & Attendance Tracker',
    assignmentTitleAr: 'مشروع الوحدة الثانية: تقييم الدرجات وتتبع الحضور',
    learnerId: 'usr-learner-3',
    learnerName: 'Khalid Omer',
    githubLink: 'https://github.com/khalid-omer/python-attendance-tracker',
    explanation: 'Implemented with recursive logic and custom condition handlers. Need teacher feedback on algorithm approach.',
    attemptNo: 2,
    status: 'escalated',
    submittedAt: '2026-11-02T08:30:00Z',
    assignedMentorId: 'usr-mentor-2',
    feedbacks: [
      {
        author: 'Omar Farouk',
        text: 'Learner implemented loops using recursion instead of while/for loops requested in the rubric. Escalating to course lead for clarification on acceptable alternatives.',
        date: '2026-11-02T11:00:00Z',
      },
    ],
  },
  {
    id: 'sub-104',
    topicId: 'topic-1',
    assignmentTitleEn: 'Module 1 Project: Student Expense & Currency Calculator',
    assignmentTitleAr: 'مشروع الوحدة الأولى: حاسبة مصروفات الطالب وتحويل العملات',
    learnerId: 'usr-learner-4',
    learnerName: 'Yassir Nour',
    githubLink: 'https://github.com/yassir-nour/expense-calculator',
    explanation: 'Full solution with formatted tables and daily expenditure limits.',
    attemptNo: 1,
    status: 'complete',
    submittedAt: '2026-10-29T12:00:00Z',
    assignedMentorId: 'usr-mentor-1',
    feedbacks: [
      {
        author: 'Sarah Ibrahim',
        text: 'Excellent implementation of currency calculation with clean f-string formatting and comprehensive error handling. Great job!',
        date: '2026-10-29T16:45:00Z',
      },
    ],
  },
];
