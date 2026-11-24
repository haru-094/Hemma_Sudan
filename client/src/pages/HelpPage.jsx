import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  BookOpen, 
  WifiOff, 
  UserCheck, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

export default function HelpPage() {
  const { isRTL } = useLanguage();
  const [activeSection, setActiveSection] = useState('learner');

  const sections = [
    {
      id: 'learner',
      titleEn: 'Learner Guide',
      titleAr: 'دليل الطالب',
      icon: BookOpen,
    },
    {
      id: 'offline',
      titleEn: 'Offline & PWA Storage',
      titleAr: 'الدراسة بدون إنترنت والمزامنة',
      icon: WifiOff,
    },
    {
      id: 'mentor',
      titleEn: 'Mentor Review Guide',
      titleAr: 'دليل المرشد البرمجي',
      icon: UserCheck,
    },
    {
      id: 'teacher',
      titleEn: 'Teacher Hub Guide',
      titleAr: 'دليل الأستاذ وإدارة المساق',
      icon: ShieldCheck,
    },
    {
      id: 'troubleshooting',
      titleEn: 'Troubleshooting & FAQ',
      titleAr: 'حل المشكلات الشائعة',
      icon: AlertCircle,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
            ?
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isRTL ? 'مركز المساعدة ودليل الاستخدام' : 'In-App Documentation & Help Center'}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          {isRTL
            ? 'دليل استرشادي شامل للطلاب، المرشدين، وأساتذة المادة وفقاً لمواصفات متطلبات منصة همة سودان (SRS Section 2.6).'
            : 'Comprehensive user guides and troubleshooting protocols for learners, mentors, and instructors (SRS Section 2.6).'}
        </p>
      </div>

      {/* Main Layout: Tabs on Left/Right + Content on Right/Left */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 bg-white dark:bg-[#151d30] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3 space-y-1 shadow-2xs">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left rtl:text-right ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-400'}`} />
                <span>{isRTL ? sec.titleAr : sec.titleEn}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Body */}
        <main className="flex-1 w-full bg-white dark:bg-[#151d30] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
          
          {/* SECTION 1: LEARNER GUIDE */}
          {activeSection === 'learner' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  <span>{isRTL ? 'دليل الطالب وسير الدراسة' : 'Learner Study Guide & Workflow'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRTL ? 'كيفية دراسة المناهج وحل الاختبارات وتسليم المشاريع' : 'How to navigate modules, complete knowledge checks, and submit code.'}
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center font-bold">1</span>
                    <span>{isRTL ? 'دراسة المفاهيم البرمجية والأمثلة' : 'Study Core Concepts & Code Snippets'}</span>
                  </h4>
                  <p>
                    {isRTL
                      ? 'اختر المسار المناسب لك (بايثون، سي++، أو جافا). يبدأ كل درس بالمثال الأساسي ثم ينتقل للتطبيق المتقدم. جميع الشيفرات معروضة بتنسيق LTR حصراً مع المخرجات المتوقعة.'
                      : 'Choose your language track (Python, C++, or Java). Each lesson starts with fundamental syntax and moves to advanced applications with verified expected terminal outputs.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center font-bold">2</span>
                    <span>{isRTL ? 'التطبيق العملي في محرر الأكواد (VS Code)' : 'Write Code in your Local IDE'}</span>
                  </h4>
                  <p>
                    {isRTL
                      ? 'المنصة خفيفة ومصممة لدعم الاتصال المحدود، لذا لا يتم تنفيذ الكود داخل المتصفح. قم بكتابة وتجربة البرامج على جهازك في Visual Studio Code أو الطرفية.'
                      : 'To stay ultra-lightweight and battery-efficient, code is executed locally in your own IDE (VS Code), not in a bloated browser sandbox.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center font-bold">3</span>
                    <span>{isRTL ? 'تسليم مشاريع الوحدات عبر GitHub' : 'Submit Capstone via Public GitHub Repo'}</span>
                  </h4>
                  <p>
                    {isRTL
                      ? 'عند إنهاء كل وحدة، قم بدفع الكود إلى مستودع عام على GitHub وقدم الرابط مع شرح مختصر لحلك. يتطلب التسليم اتصال إنترنت نشطاً ولا يتم حفظه في طابور الانتظار.'
                      : 'At the end of each module, push your code to a public GitHub repository and submit the link. Submissions require active connectivity and are never queued offline.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: OFFLINE & PWA GUIDE */}
          {activeSection === 'offline' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <WifiOff className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  <span>{isRTL ? 'العمل بدون إنترنت وإدارة التخزين (PWA & IndexedDB)' : 'Offline Learning & Local Storage'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRTL ? 'كيف تواصل دراستك حتى عند انقطاع شبكة الاتصالات في السودان' : 'How the offline engine keeps your progress safe during internet blackouts.'}
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-200">
                    {isRTL ? 'حفظ الدروس للاستخدام بدون إنترنت' : 'Caching Lessons for Offline Study'}
                  </h4>
                  <p>
                    {isRTL
                      ? 'انقر على "حفظ بدون إنترنت" أو زر "حفظ كامل الوحدة". يتم تخزين نصوص الدروس والأمثلة والاختبارات في مساحة المتصفح الآمنة (IndexedDB).'
                      : 'Click "Save for offline" or "Save whole module". All theoretical notes, code samples, and self-assessment quizzes are stored in your browser’s IndexedDB.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">
                    {isRTL ? 'حل التعارض التلقائي للتقدم' : 'Automatic Progress Sync Conflict Resolution'}
                  </h4>
                  <p>
                    {isRTL
                      ? 'عند استعادة الاتصال، تعتمد المنصة مبدأ "التقدم الأكثر اكتمالاً يفوز" (Furthest Progress Wins). لن يتم أبداً إرجاع درجاتك أو تقليل نسبة إنجازك.'
                      : 'When your connection returns, the system resolves sync conflicts using "Furthest Progress Wins". Your completed quizzes and higher completion percentages will never be overwritten.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1.5">
                  <h4 className="font-bold text-amber-900 dark:text-amber-200">
                    {isRTL ? 'تحديثات المحتوى من الأستاذ' : 'Content Update Notifications'}
                  </h4>
                  <p>
                    {isRTL
                      ? 'إذا عدّل أستاذ المادة محتوى درس حفظته مسبقاً، سيظهر وسم برتقالي "تحديث متوفر". يمكنك تحديث نسختك بنقرة واحدة دون التأثير على درجاتك المسجلة.'
                      : 'If the course instructor publishes an updated version of a cached lesson, an "Update available" badge appears. Refreshing updates the content without erasing your quiz progress.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: MENTOR REVIEW GUIDE */}
          {activeSection === 'mentor' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                  <span>{isRTL ? 'دليل المرشد البرمجي (Mentor Protocol)' : 'Mentor Evaluation & Feedback Guide'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRTL ? 'معايير مراجعة الأكواد وصلاحيات المحاور والتصعيد' : 'Topic-restricted reviews, capstone grading rubric, and escalation flow.'}
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>
                  {isRTL
                    ? 'المرشدون هم معيدون أو طلاب متقدمون معتمدون من قبل الأستاذ. لا يمكن للمرشد تقييم واجبات إلا في المحاور التي منحه الأستاذ صلاحيتها صراحة.'
                    : 'Mentors are accredited by the course lead. Mentors can only review submissions for topics they have been explicitly accredited for.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1">
                    <h5 className="font-bold text-emerald-900 dark:text-emerald-200">
                      {isRTL ? 'اعتماد الحل وتأكيد الإنجاز' : 'Approve & Mark Complete'}
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {isRTL
                        ? 'إذا استوفى المشروع معايير الدليل ونظافة الكود، يتم اعتماد الواجب وتوثيق المراجعة.'
                        : 'Approved when code meets rubric requirements and demonstrates proper input handling.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 space-y-1">
                    <h5 className="font-bold text-amber-900 dark:text-amber-200">
                      {isRTL ? 'طلب مراجعة مع توجيهات' : 'Request Revision'}
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {isRTL
                        ? 'إرجاع الحل للطالب مع ملاحظات بناّءة، مما يتيح له إعادة المحاولة.'
                        : 'Requests revision with targeted remarks, allowing the student to resubmit.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: TEACHER HUB GUIDE */}
          {activeSection === 'teacher' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  <span>{isRTL ? 'دليل الأستاذ وإدارة المساق' : 'Teacher Hub & Course Administration'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRTL ? 'صلاحيات منشئ المحتوى، مصفوفة المرشدين، والرقابة الأمنية' : 'Curriculum authoring, mentor accreditation, and audit compliance.'}
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>{isRTL ? 'منشئ المحتوى والترجمة:' : 'Curriculum Authoring:'} </strong> 
                    {isRTL
                      ? 'إنشاء الدروس بالإنجليزية، وتوليد مسودة الترجمة العربية آلياً عبر LibreTranslate، واعتمادها للنشر.'
                      : 'Author lessons in English, generate machine drafts via LibreTranslate, and approve for publishing.'}
                  </li>
                  <li>
                    <strong>{isRTL ? 'مصفوفة اعتماد المرشدين:' : 'Mentor Topic Matrix:'} </strong>
                    {isRTL
                      ? 'منح وإلغاء صلاحيات كل مرشد لكل محور بشكل مستقل مع ترقية دور الطالب لمرشد آلياً.'
                      : 'Toggle mentor grading permissions on a topic-by-topic basis with instant promotion.'}
                  </li>
                  <li>
                    <strong>{isRTL ? 'حل التصعيدات المعلقة:' : 'Escalations Resolution:'} </strong>
                    {isRTL
                      ? 'البت في النزاعات أو الواجبات المحالة من الطلاب أو المرشدين بقرار نهائي ملزم.'
                      : 'Make final, binding grading decisions on disputed or directly escalated submissions.'}
                  </li>
                  <li>
                    <strong>{isRTL ? 'إعادة تعيين كلمات المرور وتطهير البيانات:' : 'Credentials & Data Purge:'} </strong>
                    {isRTL
                      ? 'إعادة تعيين كلمة مرور الطلاب يدوياً أثناء انقطاع البريد الإلكتروني، وتطهير بيانات التجربة غير المعتمدة.'
                      : 'Manually reset student passwords during email outages, and execute data consent purges.'}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* SECTION 5: TROUBLESHOOTING & FAQ */}
          {activeSection === 'troubleshooting' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
                  <span>{isRTL ? 'حل المشكلات الشائعة والأسئلة المتكررة' : 'Troubleshooting & Frequently Asked Questions'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRTL ? 'حلول سريعة لأعطال الاتصال وإعادة المصادقة وتوافق المتصفح' : 'Quick fixes for connection drops, session expiry, and browser compatibility.'}
                </p>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">
                    {isRTL ? 'س: ماذا أفعل إذا انتهت جلستي أثناء انقطاع الإنترنت؟' : 'Q: What happens if my session expires while offline?'}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    {isRTL
                      ? 'ج: وفقاً للمسار البديل 3 في SRS، تظل بياناتك ومحاولاتك في قائمة الانتظار المحلية. بمجرد عودة الاتصال، يطلب منك تسجيل الدخول ويتم تفريغ كافة التحديثات بنجاح دون فقدان أي بيانات.'
                      : 'A: Per Alternative Flow 3, your local updates remain securely queued in IndexedDB. Once re-authenticated, the sync queue flushes automatically with zero data loss.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">
                    {isRTL ? 'س: لماذا لا يمكنني تسليم المشروع أثناء انقطاع الإنترنت؟' : 'Q: Why is project submission disabled offline?'}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    {isRTL
                      ? 'ج: تسليمات GitHub تتطلب اتصالاً مباشراً للتحقق من وجود المستودع العام، ولا يتم تخزين روابط المشاريع في طابور الانتظار منعاً لتضارب النسخ.'
                      : 'A: GitHub project submissions require active connectivity to validate public reachability, preventing dangling or invalid links.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">
                    {isRTL ? 'س: نسيت كلمة المرور ولم تصلني رسالة استعادة بالبريد؟' : 'Q: I forgot my password and email recovery is not working?'}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    {isRTL
                      ? 'ج: نظراً لضعف الاتصالات، تم تعطيل الاستعادة الآلية عبر البريد. تواصل مع أستاذ المساق وسيقوم بإصدار كلمة مرور مؤقتة لحسابك مباشرة من لوحة التحكم.'
                      : 'A: Because automated email is unreliable during outages, contact your teacher directly to issue an emergency temporary password via the Teacher Console.'}
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
