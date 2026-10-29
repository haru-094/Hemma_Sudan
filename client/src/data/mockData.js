export const TOPICS = [
  {
    id: 'topic-1',
    displayOrder: 1,
    titleEn: '1. Python Fundamentals & Input Processing',
    titleAr: '١. أساسيات لغة بايثون ومعالجة المدخلات',
    descriptionEn: 'Variables, data types, arithmetic operators, string formatting, and terminal input.',
    descriptionAr: 'المتغيرات، أنواع البيانات، العمليات الحسابية، تنسيق النصوص، ومدخلات الطرفية.',
    lessons: ['lesson-1', 'lesson-2'],
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
          explanationEn: 'The // operator performs integer floor division, returning 3 without the decimal remainder.',
          explanationAr: 'المعامل // يقوم بالقسمة الصحيحة (Floor Division)، فيعيد الناتج 3 مهملاً الكسور.',
        },
        {
          id: 'q1-2',
          questionEn: 'By default, what data type does the built-in input() function return?',
          questionAr: 'ما هو نوع البيانات الافتراضي الذي تعيده دالة input() في بايثون؟',
          optionsEn: ['int', 'float', 'str (string)', 'bool'],
          optionsAr: ['int', 'float', 'str (نص)', 'bool'],
          correctIndex: 2,
          explanationEn: 'input() always reads input from the user as a string. You must use int() or float() to convert it.',
          explanationAr: 'تعيد دالة input() المدخلات دائماً كسلسلة نصية (str)، ويجب تحويلها يدوياً إذا كانت رقماً.',
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
      promptEn: `Develop a command-line Python application that helps university students track monthly expenses and currency conversions:
1. Prompt for student name, university, and monthly budget in SDG (Sudanese Pounds).
2. Capture estimated costs for transportation, study materials, and internet cards.
3. Compute total expenses, remaining balance, and average daily allowance.
4. Output a cleanly formatted summary using f-strings with formatted currency values.
5. Push your code to a public GitHub repository with a README.md explaining how to run it.`,
      promptAr: `قم ببناء برنامج بايثون يعمل عبر الطرفية لمساعدة طلاب الجامعات على إدارة مصاريفهم الشهرية:
1. اطلب من المستخدم إدخال اسمه، اسم جامعته، والميزانية الشهرية بالجنيه السوداني.
2. استقبل تكاليف المواصلات، الكتب والمراجع، وباقات الإنترنت.
3. احسب إجمالي المصروفات، الرصيد المتبقي، ومتوسط الإنفاق اليومي.
4. اعرض ملخصاً منسقاً باستخدام f-strings.
5. ارفع المشروع إلى مستودع GitHub عام مع ملف README.md يشرح طريقة التشغيل.`,
    },
  },
  {
    id: 'topic-2',
    displayOrder: 2,
    titleEn: '2. Control Flow, Conditionals & Loops',
    titleAr: '٢. تدفق التحكم، الشروط، والتكرار (الحلقات)',
    descriptionEn: 'Making decisions with if/elif/else and automating repetitions with while and for loops.',
    descriptionAr: 'اتخاذ القرارات عبر if/elif/else وتكرار العمليات عبر حلقات for و while.',
    lessons: ['lesson-3', 'lesson-4'],
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
          explanationEn: 'range(2, 8, 2) starts at 2, increments by 2, and stops before 8, yielding 2, 4, 6.',
          explanationAr: 'الدالة range(2, 8, 2) تبدأ من 2 وتقفز بقيمة 2 وتتوقف قبل 8، فتنتج القيم 2 و 4 و 6.',
        },
        {
          id: 'q2-2',
          questionEn: 'Which keyword immediately exits a loop regardless of the condition?',
          questionAr: 'ما هي الكلمة المفتاحية التي تنهي تنفيذ الحلقة فوراً بغض النظر عن الشرط؟',
          optionsEn: ['break', 'continue', 'pass', 'return'],
          optionsAr: ['break', 'continue', 'pass', 'return'],
          correctIndex: 0,
          explanationEn: 'break immediately terminates the nearest enclosing loop.',
          explanationAr: 'الأمر break يقطع الحلقة ويوقف تكرارها فوراً.',
        },
      ],
    },
    assignment: {
      id: 'assign-2',
      titleEn: 'Module 2 Project: Academic Grading & Attendance System',
      titleAr: 'مشروع الوحدة الثانية: نظام احتساب الدرجات ونسب الحضور الأكاديمي',
      promptEn: `Create an interactive Python terminal program for grading students:
1. Accept grades for multiple assessments and enforce validation (scores between 0 and 100).
2. Determine grade classification (Distinction, Merit, Pass, Fail) with conditional logic.
3. Allow the teacher to repeatedly enter records until they type 'quit' using a loop.
4. Output class summary: Highest score, lowest score, and class average.
5. Push to GitHub and provide repository link with code explanation.`,
      promptAr: `أنشئ برنامجاً تفاعلياً بلغة بايثون لإدارة درجات الطلاب وحساب التقديرات:
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
    descriptionEn: 'Decomposing problems into reusable functions, default parameters, and pure functions.',
    descriptionAr: 'تقسيم المشاكل البرمجية إلى دوال قابلة لإعادة الاستخدام، المعاملات، والنطاق.',
    lessons: ['lesson-5'],
    quiz: {
      id: 'quiz-3',
      titleEn: 'Module 3 Knowledge Check (Self-Assessment)',
      titleAr: 'اختبار تقييم المفاهيم للوحدة الثالثة',
      questions: [
        {
          id: 'q3-1',
          questionEn: 'What does a Python function return if it contains no return statement?',
          questionAr: 'ماذا تعيد دالة بايثون إذا لم تحتوي على جملة return؟',
          optionsEn: ['0', 'None', 'False', 'SyntaxError'],
          optionsAr: ['0', 'None', 'False', 'SyntaxError'],
          correctIndex: 1,
          explanationEn: 'In Python, functions without an explicit return statement return None by default.',
          explanationAr: 'في بايثون، أي دالة لا تحتوي على return صريحة تُرجع القيمة None افتراضياً.',
        },
      ],
    },
    assignment: {
      id: 'assign-3',
      titleEn: 'Module 3 Project: Modular Inventory & Supply Tracker',
      titleAr: 'مشروع الوحدة الثالثة: نظام إدارة المخزون المعياري بالدوال',
      promptEn: `Build a modular inventory management script:
1. Write separate functions for adding items, updating stock, and generating inventory reports.
2. Implement input validation functions.
3. Document each function with clear docstrings.
4. Submit repository link with documentation.`,
      promptAr: `أنشئ نظاماً معيارياً لإدارة المخزون باستخدام الدوال المنفصلة مع توثيق Docstrings ورفع المشروع إلى GitHub.`,
    },
  },
];

export const LESSONS = [
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
    notesEn: `In this lesson, you will learn how to declare variables in Python and interact with user input.
Python is dynamically typed, meaning you do not need to specify the type explicitly.

Key Concepts:
- Variables store values in memory.
- Use input() to capture data from the terminal.
- Basic arithmetic operations: +, -, *, /, //, %`,
    notesAr: `في هذا الدرس، ستتعلم كيفية تعريف المتغيرات في لغة بايثون والتعامل مع مدخلات المستخدم.
بايثون لغة ديناميكية النوع، مما يعني أنك لا تحتاج إلى تحديد نوع المتغير مسبقاً.

المفاهيم الأساسية:
- المتغيرات تخزن القيم في الذاكرة.
- استخدام input() لاستقبال المدخلات من الطرفية.
- العمليات الحسابية الأساسية: +, -, *, /, //, %`,
    codeSnippet: `# Variables and Arithmetic Demonstration
user_name = input("Enter your name: ")
study_hours = int(input("How many hours do you plan to study per week? "))

daily_average = study_hours / 7.0
print(f"Welcome, {user_name}! Your daily target is {daily_average:.2f} hours.")`,
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
    notesEn: `Strings in Python are sequences of characters enclosed in quotes.
You can format strings using f-strings for readability and clean output.`,
    notesAr: `النصوص في بايثون عبارة عن تسلسل من الأحرف المحاطة بعلامات اقتباس.
يمكنك تنسيق النصوص باستخدام f-strings لقراءة أفضل وتنظيم الشيفرة.`,
    codeSnippet: `# String manipulation and formatted strings
city = "Khartoum"
temp = 38.5
status = f"Current temperature in {city} is {temp}°C."
print(status.upper())`,
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
    notesEn: `Conditionals allow your program to take different branches based on boolean evaluations.`,
    notesAr: `تتيح الجمل الشرطية لبرنامجك اتخاذ مسارات مختلفة بناءً على تقييم الشروط المنطقية.`,
    codeSnippet: `score = int(input("Enter your exam score: "))
if score >= 85:
    grade = "Distinction"
elif score >= 60:
    grade = "Pass"
else:
    grade = "Needs Improvement"
print(f"Result: {grade}")`,
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
    notesEn: `Loops automate repetitive tasks. A for loop iterates over a sequence, while a while loop repeats as long as a condition is True.`,
    notesAr: `تستخدم الحلقات لتكرار العمليات التلقائية. تدور حلقة for على عناصر متسلسلة، بينما تستمر حلقة while ما دام الشرط صحيحاً.`,
    codeSnippet: `# Summing numbers with a for loop
total = 0
for i in range(1, 6):
    total += i
print(f"Sum of 1 to 5 is: {total}")`,
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
    notesEn: `Functions help break problems into manageable blocks, reduce repetition, and make code testable.`,
    notesAr: `تساعد الدوال على تقسيم المشكلات إلى أجزاء سهلة الإدارة، وتمنع تكرار الكود، وتسهل اختباره.`,
    codeSnippet: `def calculate_gpa(scores):
    if not scores:
        return 0.0
    return sum(scores) / len(scores)

my_scores = [88, 92, 79, 95]
print(f"Your average score is: {calculate_gpa(my_scores):.2f}")`,
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
    status: 'under_review', // 'submitted' | 'under_review' | 'feedback_given' | 'revision_requested' | 'escalated' | 'complete'
    submittedAt: '2026-10-28T14:20:00Z',
    assignedMentorId: 'usr-mentor-1',
    feedbacks: [],
  },
];
