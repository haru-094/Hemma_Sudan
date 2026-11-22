import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSync } from '../context/SyncContext';
import { LESSONS, TOPICS, TRACKS } from '../data/mockData';
import TopicQuiz from '../components/quiz/TopicQuiz';
import { 
  ArrowLeft, 
  ArrowRight, 
  DownloadCloud, 
  CheckCircle, 
  Video, 
  ExternalLink, 
  Code, 
  HelpCircle,
  FolderGit2,
  BookOpen,
  RefreshCw,
  AlertTriangle,
  Copy,
  Check,
  Sparkles,
  Layers,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Compass,
  Cpu,
  GraduationCap
} from 'lucide-react';

export default function LessonDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, isRTL, language } = useLanguage();
  const { recordProgress, isLessonSaved, toggleSaveOffline, lessonContentStatus, refreshSavedLesson } = useSync();

  // Track selection: read from query param or default to 'python'
  const trackParam = searchParams.get('track');
  const [selectedTrack, setSelectedTrack] = useState(() => {
    return TRACKS.find((tr) => tr.id === trackParam)?.id || 'python';
  });

  const [completed, setCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedBasic, setCopiedBasic] = useState(false);
  const [copiedAdv, setCopiedAdv] = useState(false);

  useEffect(() => {
    if (trackParam && TRACKS.some((tr) => tr.id === trackParam)) {
      setSelectedTrack(trackParam);
    }
  }, [trackParam]);

  const handleSelectTrack = (trackId) => {
    setSelectedTrack(trackId);
    setSearchParams({ track: trackId });
  };

  const ArrowBackIcon = isRTL ? ArrowRight : ArrowLeft;
  const ArrowNextIcon = isRTL ? ArrowLeft : ArrowRight;

  const currentTrack = TRACKS.find((tr) => tr.id === selectedTrack) || TRACKS[0];
  const lesson = LESSONS.find((l) => l.id === id) || LESSONS[0];
  const topic = TOPICS.find((top) => top.id === lesson.topicId);
  const topicLessons = LESSONS.filter((l) => l.topicId === lesson.topicId);
  const currentIdx = topicLessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = topicLessons[currentIdx + 1];
  const prevLesson = topicLessons[currentIdx - 1];
  const isLastLesson = currentIdx === topicLessons.length - 1;
  const saved = isLessonSaved(lesson.id);

  // Content for the active track
  const trackData = lesson.languages?.[selectedTrack];
  const basicContent = trackData?.basic;
  const advContent = trackData?.advanced;

  // Fallback to top-level content if track structure is absent
  const basicNotes = language === 'ar'
    ? (basicContent?.notesAr || lesson.notesAr)
    : (basicContent?.notesEn || lesson.notesEn);
  const basicSnippet = basicContent?.codeSnippet || lesson.codeSnippet;

  const advNotes = advContent ? (language === 'ar' ? advContent.notesAr : advContent.notesEn) : null;
  const advSnippet = advContent?.codeSnippet || null;

  const handleCopy = (code, type) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
      if (type === 'basic') {
        setCopiedBasic(true);
        setTimeout(() => setCopiedBasic(false), 2000);
      } else {
        setCopiedAdv(true);
        setTimeout(() => setCopiedAdv(false), 2000);
      }
    }
  };

  const handleMarkComplete = () => {
    recordProgress(lesson.id, 100, 'completed');
    setCompleted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb & Mobile Sidebar Toggle */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>{isRTL ? 'قائمة المنهج' : 'Curriculum Menu'}</span>
          </button>

          <Link
            to="/lessons"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowBackIcon className="w-4 h-4" />
            <span>{t.common.back}</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Track Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <span>{currentTrack.icon}</span>
            <span>{language === 'ar' ? currentTrack.shortTitleAr : currentTrack.shortTitleEn}</span>
          </div>

          {/* Offline Save Toggle */}
          <button
            onClick={() => toggleSaveOffline(lesson.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
              saved
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <DownloadCloud className="w-4 h-4" />
            <span>{saved ? t.common.savedOffline : t.common.saveOffline}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout: Sidebar (Left in LTR) + Lesson Content (Right) */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
        
        {/* ========================================================= */}
        {/* SIDEBAR: Track Focus + Module & Lesson Navigator          */}
        {/* ========================================================= */}
        <aside
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } lg:block lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6 mb-6 lg:mb-0 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto`}
        >
          {/* Focus Track Switcher */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isRTL ? 'المسار التخصصي المركز:' : 'Focus Language Track:'}</span>
            </label>

            <div className="grid grid-cols-1 gap-1.5">
              {TRACKS.map((track) => {
                const isActive = selectedTrack === track.id;
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      handleSelectTrack(track.id);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-xs font-bold text-left rtl:text-right flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{track.icon}</span>
                      <div>
                        <div className="font-bold">
                          {language === 'ar' ? track.shortTitleAr : track.shortTitleEn}
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal">
                          {language === 'ar' ? track.badgeAr : track.badgeEn}
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {currentTrack.isSairTrack && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-2.5 text-[11px] text-purple-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>
                  {isRTL
                    ? 'مسار الذكاء الاصطناعي معتمد بالشراكة مع الباحثين السودانيين في الذكاء الاصطناعي (SAIR).'
                    : 'Curated in partnership with Sudanese Artificial Intelligence Researchers (SAIR).'}
                </span>
              </div>
            )}
          </div>

          {/* Curriculum Hierarchy */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isRTL ? 'وحدات ودروس المسار' : 'Track Curriculum'}
            </h4>

            <div className="space-y-3">
              {TOPICS.map((top) => {
                const isCurrentTopic = top.id === lesson.topicId;
                const lessonsOfTopic = LESSONS.filter((l) => l.topicId === top.id);

                return (
                  <div
                    key={top.id}
                    className={`rounded-xl border transition-all ${
                      isCurrentTopic
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    {/* Module Title */}
                    <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase text-emerald-700">
                          {isRTL ? `الوحدة ${top.displayOrder}` : `Module ${top.displayOrder}`}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 leading-snug">
                          {language === 'ar' ? top.titleAr : top.titleEn}
                        </h5>
                      </div>
                      {top.sairTrack && (
                        <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded shrink-0">
                          SAIR
                        </span>
                      )}
                    </div>

                    {/* Lessons list for this module */}
                    <div className="divide-y divide-slate-100/70 p-1">
                      {lessonsOfTopic.map((les, idx) => {
                        const isCurrentLesson = les.id === lesson.id;
                        const isSaved = isLessonSaved(les.id);

                        return (
                          <Link
                            key={les.id}
                            to={`/lessons/${les.id}?track=${selectedTrack}`}
                            onClick={() => setSidebarOpen(false)}
                            className={`p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                              isCurrentLesson
                                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span
                                className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                                  isCurrentLesson
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {idx + 1}
                              </span>
                              <span className="truncate">
                                {language === 'ar' ? les.titleAr : les.titleEn}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {isSaved && (
                                <DownloadCloud
                                  className={`w-3.5 h-3.5 ${
                                    isCurrentLesson ? 'text-emerald-200' : 'text-emerald-600'
                                  }`}
                                />
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Module Checkpoint Links */}
                    <div className="bg-slate-50/70 p-2 rounded-b-xl border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <Link
                        to={`/lessons/${lessonsOfTopic[lessonsOfTopic.length - 1]?.id}?track=${selectedTrack}#module-quiz`}
                        className="text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1"
                      >
                        <HelpCircle className="w-3 h-3 text-amber-600" />
                        <span>{isRTL ? 'الاختبار' : 'Quiz'}</span>
                      </Link>

                      <Link
                        to={`/project/${top.id}`}
                        className="text-slate-800 hover:text-slate-900 font-semibold flex items-center gap-1"
                      >
                        <FolderGit2 className="w-3 h-3 text-emerald-600" />
                        <span>{isRTL ? 'المشروع' : 'Project'}</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MAIN LESSON CONTENT: Basic Example -> Advanced Example    */}
        {/* ========================================================= */}
        <main className="lg:col-span-8 space-y-6">
          {/* Content Conflict Banners (FR-5.6) */}
          {saved && lessonContentStatus?.[lesson.id] === 'update_available' && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-xs">
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <strong className="block font-bold">
                    {isRTL ? 'تحديث متوفر لهذا الدرس على الخادم' : 'Lesson Update Available'}
                  </strong>
                  <span className="text-amber-800 text-[11px]">
                    {isRTL
                      ? 'قام أستاذ المادة بتحديث محتوى هذا الدرس. اضغط على الزر لتحديث نسختك المحفوظة دون التأثير على تقدمك.'
                      : 'The course lead has published an updated version of this lesson. Refresh to sync your offline copy.'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => refreshSavedLesson(lesson.id)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shrink-0 shadow-xs transition-colors cursor-pointer"
              >
                {isRTL ? 'تحديث النسخة المحفوظة' : 'Refresh Saved Copy'}
              </button>
            </div>
          )}

          {/* Lesson Title Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                {language === 'ar' ? topic?.titleAr : topic?.titleEn}
              </span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                <span>{currentTrack.icon}</span>
                <span>{language === 'ar' ? currentTrack.shortTitleAr : currentTrack.shortTitleEn}</span>
              </span>
              {topic?.sairTrack && (
                <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>{isRTL ? 'مسار مجتمع SAIR' : 'SAIR AI Track'}</span>
                </span>
              )}
              <span className="text-xs text-slate-400 font-medium ml-auto rtl:mr-auto rtl:ml-0">
                {isRTL
                  ? `الدرس ${currentIdx + 1} من ${topicLessons.length}`
                  : `Lesson ${currentIdx + 1} of ${topicLessons.length}`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {language === 'ar' ? lesson.titleAr : lesson.titleEn}
            </h1>
          </div>

          {/* External Live Session Link */}
          {lesson.recordingLink && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-900">
                    {isRTL ? 'تسجيل الجلسة التفاعلية المباشرة' : 'Recorded Live Class Session'}
                  </h4>
                  <p className="text-xs text-blue-700">
                    {isRTL
                      ? 'مستضاف خارجياً على Google Meet. يتطلب اتصال إنترنت نشط.'
                      : 'Hosted externally on Google Meet. Requires active internet connection to view.'}
                  </p>
                </div>
              </div>
              <a
                href={lesson.recordingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1 shrink-0"
              >
                <span>{isRTL ? 'مشاهدة' : 'Watch'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* ========================================================= */}
          {/* PART 1: BASIC LEVEL (الأساسيات والمثال التمهيدي)           */}
          {/* ========================================================= */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center justify-center">
                  ★
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isRTL ? '١. المفاهيم الأساسية والأمثلة التمهيدية' : '1. Core Foundations & Basic Example'}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {isRTL ? 'بناء الفهم الجوهري للصيغة البرمجية' : 'Essential syntax and principles'}
                  </span>
                </div>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {currentTrack.shortTitleEn} • Basic
              </span>
            </div>

            {/* Basic Notes */}
            <div className="prose max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {basicNotes}
            </div>

            {/* Basic Code Snippet Box (Strictly LTR) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-emerald-600" />
                  <span>
                    {isRTL
                      ? `شيفرة ${currentTrack.shortTitleAr} الأساسية`
                      : `${currentTrack.shortTitleEn} Basic Example`}
                  </span>
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">{currentTrack.syntax}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(basicSnippet, 'basic')}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedBasic ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">{isRTL ? 'تم النسخ' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>{isRTL ? 'نسخ الكود' : 'Copy Code'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div
                dir="ltr"
                className="ltr-forced rounded-xl bg-slate-900 text-slate-100 p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono border border-slate-800 shadow-inner"
              >
                <pre className="m-0 leading-relaxed">
                  <code>{basicSnippet}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* PART 2: ADVANCED LEVEL (المفاهيم المتقدمة والتطبيقات)    */}
          {/* ========================================================= */}
          {advNotes && (
            <section className="bg-white rounded-2xl border-2 border-purple-200/80 p-6 sm:p-7 space-y-5 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500"></div>

              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 text-xs font-extrabold flex items-center justify-center">
                    ★★
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span>{isRTL ? '٢. التطبيق المتقدم والممارسات الهندسية' : '2. Advanced Concepts & Real-World Application'}</span>
                      {selectedTrack === 'python' && (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                          SAIR AI Track
                        </span>
                      )}
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      {isRTL
                        ? 'كفاءة الحوسبة، أنابيب معالجة البيانات، ونماذج الذكاء الاصطناعي'
                        : 'Algorithmic performance, data pipelines & AI modeling'}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                  {currentTrack.shortTitleEn} • Advanced
                </span>
              </div>

              {/* Advanced Notes */}
              <div className="prose max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {advNotes}
              </div>

              {/* Advanced Code Snippet Box (Strictly LTR) */}
              {advSnippet && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-purple-600" />
                      <span>
                        {isRTL
                          ? `شيفرة ${currentTrack.shortTitleAr} المتقدمة`
                          : `${currentTrack.shortTitleEn} Advanced Implementation`}
                      </span>
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">{currentTrack.syntax}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(advSnippet, 'adv')}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedAdv ? (
                          <>
                            <Check className="w-3 h-3 text-purple-600" />
                            <span className="text-purple-700">{isRTL ? 'تم النسخ' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{isRTL ? 'نسخ الكود' : 'Copy Code'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div
                    dir="ltr"
                    className="ltr-forced rounded-xl bg-slate-900 text-slate-100 p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono border border-purple-950 shadow-inner"
                  >
                    <pre className="m-0 leading-relaxed">
                      <code>{advSnippet}</code>
                    </pre>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Lesson Completion & Navigation Action Footer */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <button
              onClick={handleMarkComplete}
              disabled={completed}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                completed
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>
                {completed
                  ? isRTL
                    ? 'تم تسجيل قراءة الدرس بنجاح'
                    : 'Lesson Completed'
                  : isRTL
                  ? 'تسجيل إكمال هذا الدرس'
                  : 'Mark as Completed'}
              </span>
            </button>

            {/* Navigation to Next Lesson or Quiz */}
            <div className="flex items-center gap-2">
              {prevLesson && (
                <Link
                  to={`/lessons/${prevLesson.id}?track=${selectedTrack}`}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1"
                >
                  <ArrowBackIcon className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'الدرس السابق' : 'Previous'}</span>
                </Link>
              )}

              {nextLesson ? (
                <Link
                  to={`/lessons/${nextLesson.id}?track=${selectedTrack}`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1 shadow-xs"
                >
                  <span>{isRTL ? 'الدرس التالي' : 'Next Lesson'}</span>
                  <ArrowNextIcon className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  onClick={() => setShowQuiz(true)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold inline-flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'بدء اختبار تقييم الوحدة' : 'Take Module Quiz'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Module Quiz Section */}
          {(showQuiz || isLastLesson) && topic?.quiz && !quizCompleted && (
            <div id="module-quiz" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-600" />
                  <span>
                    {isRTL
                      ? 'المحطة الختامية للوحدة: اختبار التقييم ومشروع التطبيق'
                      : 'Module Assessment & Capstone Project'}
                  </span>
                </h2>
              </div>

              <TopicQuiz
                quiz={topic.quiz}
                onProceedToAssignment={() => navigate(`/project/${topic.id}`)}
                onComplete={(score, total) => {
                  const pct = Math.round((score / total) * 100);
                  recordProgress(topic.quiz.id, pct, pct >= 60 ? 'completed' : 'attempted');
                  setQuizCompleted(true);
                }}
              />
            </div>
          )}

          {/* Quiz-completed confirmation badge */}
          {quizCompleted && topic?.quiz && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-emerald-900">
                  {isRTL ? 'تم حفظ نتيجة الاختبار' : 'Quiz result saved'}
                </span>
                <span className="text-emerald-700 mx-1">—</span>
                <span className="text-emerald-800">
                  {isRTL
                    ? 'سيتم مزامنة النتيجة مع السيرفر عند توفر الاتصال.'
                    : 'Progress queued and will sync to the server when online.'}
                </span>
              </div>
            </div>
          )}

          {/* Module Capstone Project Callout */}
          {isLastLesson && topic?.assignment && (
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {isRTL ? 'المشروع التطبيقي الشامل' : 'Unit Capstone Project'}
                  </span>
                  {topic?.sairTrack && (
                    <span className="text-[11px] font-bold text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded border border-purple-500/40">
                      {isRTL ? 'مسار أبحاث SAIR' : 'SAIR Research Track'}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold">
                  {language === 'ar' ? topic.assignment.titleAr : topic.assignment.titleEn}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isRTL
                    ? `طبق كافة المفاهيم المدروسة في هذه الوحدة بلغة مسارك (${currentTrack.shortTitleAr}) ثم ارفع الحل إلى GitHub لتقييم المرشدين.`
                    : `Consolidate all lessons into a complete project using your track language (${currentTrack.shortTitleEn}) and submit your GitHub repository for mentor evaluation.`}
                </p>
              </div>

              <Link
                to={`/project/${topic.id}`}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shrink-0 inline-flex items-center justify-center gap-2 shadow-lg transition-transform transform hover:-translate-y-0.5"
              >
                <span>{isRTL ? 'الانتقال لتقديم المشروع' : 'View & Submit Project'}</span>
                <ArrowNextIcon className="w-4 h-4" />
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
