import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSync } from '../context/SyncContext';
import { LESSONS, TOPICS } from '../data/mockData';
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
  BookOpen
} from 'lucide-react';

export default function LessonDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, isRTL, language } = useLanguage();
  const { recordProgress, isLessonSaved, toggleSaveOffline } = useSync();
  const [completed, setCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const ArrowBackIcon = isRTL ? ArrowRight : ArrowLeft;
  const ArrowNextIcon = isRTL ? ArrowLeft : ArrowRight;

  const lesson = LESSONS.find((l) => l.id === id) || LESSONS[0];
  const topic = TOPICS.find((top) => top.id === lesson.topicId);
  const topicLessons = LESSONS.filter((l) => l.topicId === lesson.topicId);
  const currentIdx = topicLessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = topicLessons[currentIdx + 1];
  const prevLesson = topicLessons[currentIdx - 1];
  const isLastLesson = currentIdx === topicLessons.length - 1;
  const saved = isLessonSaved(lesson.id);

  const handleMarkComplete = () => {
    recordProgress(lesson.id, 100, 'completed');
    setCompleted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Action Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <Link
          to="/lessons"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowBackIcon className="w-4 h-4" />
          <span>{t.common.back}</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSaveOffline(lesson.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
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

      {/* Lesson Title & Topic Badge */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
            {language === 'ar' ? topic?.titleAr : topic?.titleEn}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {isRTL ? `الدرس ${currentIdx + 1} من ${topicLessons.length}` : `Lesson ${currentIdx + 1} of ${topicLessons.length}`}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {language === 'ar' ? lesson.titleAr : lesson.titleEn}
        </h1>
      </div>

      {/* External Live Session Link (SRS §3.3) */}
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

      {/* Lesson Notes & Explanation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="prose max-w-none text-slate-800 leading-relaxed text-sm sm:text-base space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            {isRTL ? 'الشرح والمفاهيم الأساسية' : 'Concepts & Explanation'}
          </h3>
          <p className="whitespace-pre-line text-slate-700">
            {language === 'ar' ? lesson.notesAr : lesson.notesEn}
          </p>
        </div>

        {/* Code Snippet Box (Strictly LTR per FR-3.2) */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <Code className="w-4 h-4 text-emerald-600" />
              <span>{isRTL ? 'نموذج بايثون التوضيحي' : 'Python Code Example'}</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">python3</span>
          </div>

          <div
            dir="ltr"
            className="ltr-forced rounded-xl bg-slate-900 text-slate-100 p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono border border-slate-800 shadow-inner"
          >
            <pre className="m-0 leading-relaxed">
              <code>{lesson.codeSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Completion Action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleMarkComplete}
            disabled={completed}
            className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors ${
              completed
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>
              {completed
                ? isRTL
                  ? 'تم تسجيل قراءة الدرس'
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
                to={`/lessons/${prevLesson.id}`}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1"
              >
                <ArrowBackIcon className="w-3.5 h-3.5" />
                <span>{isRTL ? 'الدرس السابق' : 'Previous'}</span>
              </Link>
            )}

            {nextLesson ? (
              <Link
                to={`/lessons/${nextLesson.id}`}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1 shadow-sm"
              >
                <span>{isRTL ? 'الدرس التالي' : 'Next Lesson'}</span>
                <ArrowNextIcon className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                onClick={() => setShowQuiz(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold inline-flex items-center gap-1 shadow-sm"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{isRTL ? 'بدء اختبار تقييم الوحدة' : 'Take Module Quiz'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Module Quiz Section (Either clicked or displayed at the end of the module) */}
      {(showQuiz || isLastLesson) && topic?.quiz && (
        <div id="module-quiz" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <span>{isRTL ? 'المحطة الختامية للوحدة: اختبار التقييم ومشروع التطبيق' : 'Module Assessment & Capstone Project'}</span>
            </h2>
          </div>

          <TopicQuiz
            quiz={topic.quiz}
            onProceedToAssignment={() => navigate(`/project/${topic.id}`)}
          />
        </div>
      )}

      {/* Module Capstone Project Callout */}
      {isLastLesson && topic?.assignment && (
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {isRTL ? 'المشروع التطبيقي الشامل' : 'Unit Capstone Project'}
            </span>
            <h3 className="text-xl font-bold">
              {language === 'ar' ? topic.assignment.titleAr : topic.assignment.titleEn}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isRTL
                ? 'طبق كافة المفاهيم المدروسة في هذه الوحدة ضمن مشروع متكامل ثم ارفعه إلى GitHub لتقييم المرشدين.'
                : 'Consolidate all lessons in this module into a single program and submit your GitHub repository for mentor evaluation.'}
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
    </div>
  );
}
