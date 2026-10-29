import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useSync } from '../context/SyncContext';
import { LESSONS, TOPICS, INITIAL_SUBMISSIONS } from '../data/mockData';
import StatusBadge from '../components/common/StatusBadge';
import GithubIcon from '../components/common/GithubIcon';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  RotateCcw, 
  AlertCircle, 
  DownloadCloud, 
  RefreshCw,
  HelpCircle,
  Check,
  FolderGit2
} from 'lucide-react';

export default function LearnerDashboard() {
  const { t, isRTL, language } = useLanguage();
  const { currentUser } = useAuth();
  const { savedLessons, syncStatus, isOnline, triggerSync } = useSync();
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);

  // Handle Learner Accepts Feedback -> Completes lifecycle (State Machine Page 37)
  const handleAcceptFeedback = (subId) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === subId ? { ...sub, status: 'complete' } : sub))
    );
  };

  // Handle Learner Disagrees -> Escalates to teacher (FR-10.2 & State Machine)
  const handleEscalateToTeacher = (subId) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === subId ? { ...sub, status: 'escalated' } : sub))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Learner Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isRTL ? `مرحباً بك، ${currentUser?.name}` : `Welcome back, ${currentUser?.name}`}
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {currentUser?.role}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            {currentUser?.university || 'University of Khartoum'} • {t.appTagline}
          </p>
        </div>

        {/* Sync & Offline Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-center">
            <span className="block text-xl font-extrabold text-slate-900">{savedLessons.length}</span>
            <span className="text-[11px] text-slate-500 font-medium">
              {isRTL ? 'دروس محفوظة' : 'Saved Lessons'}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-center">
            <span className="block text-xl font-extrabold text-slate-900">
              {submissions.filter((s) => s.status === 'complete').length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {isRTL ? 'مشاريع معتمدة' : 'Completed Projects'}
            </span>
          </div>
        </div>
      </div>

      {/* Course Curriculum & Offline Readiness */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {isRTL ? 'الوحدات التعليمية والمشاريع' : 'Curriculum Modules & Project Readiness'}
          </h2>
          <Link
            to="/lessons"
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            {isRTL ? 'إدارة الدروس المحفوظة' : 'Manage Saved Lessons'}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TOPICS.map((topic) => {
            const topicLessons = LESSONS.filter((l) => l.topicId === topic.id);
            const savedCount = topicLessons.filter((l) => savedLessons.includes(l.id)).length;
            const sub = submissions.find((s) => s.topicId === topic.id);

            return (
              <div
                key={topic.id}
                className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                    {isRTL ? `المحور ${topic.displayOrder}` : `Module ${topic.displayOrder}`}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'ar' ? topic.titleAr : topic.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {language === 'ar' ? topic.descriptionAr : topic.descriptionEn}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{isRTL ? 'الدروس المحفوظة:' : 'Saved lessons:'}</span>
                    <span className="font-semibold text-slate-700">
                      {savedCount} / {topicLessons.length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{ width: `${(savedCount / topicLessons.length) * 100}%` }}
                    ></div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{isRTL ? 'حالة المشروع:' : 'Project state:'}</span>
                    {sub ? (
                      <StatusBadge status={sub.status} />
                    ) : (
                      <Link
                        to={`/project/${topic.id}`}
                        className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <FolderGit2 className="w-3.5 h-3.5" />
                        <span>{isRTL ? 'تقديم المشروع' : 'Submit Project'}</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submissions & Mentorship Tracking */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isRTL ? 'سجل تقييم مشاريع الوحدات' : 'Module Project Submission & Feedback'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isRTL
                ? 'تقييمات المرشدين، طلبات التعديل، والقرارات الأكاديمية'
                : 'Track mentor evaluations, code revision requests, and instructor decisions.'}
            </p>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-10 text-slate-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-medium">
              {isRTL ? 'لم تقم بتقديم أي مشاريع بعد.' : 'No project submissions yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => {
              const topic = TOPICS.find((t) => t.id === sub.topicId);

              return (
                <div
                  key={sub.id}
                  className="border border-slate-200 rounded-xl p-5 space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {language === 'ar' ? sub.assignmentTitleAr : sub.assignmentTitleEn}
                      </h4>
                      <span className="text-xs text-slate-500">
                        {isRTL ? `المحاولة #${sub.attemptNo}` : `Attempt #${sub.attemptNo}`} •{' '}
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <StatusBadge status={sub.status} />
                  </div>

                  {/* Submission Details */}
                  <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1.5 font-mono">
                    <div className="flex items-center gap-2">
                      <GithubIcon className="w-3.5 h-3.5 text-slate-700" />
                      <a
                        href={sub.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:underline ltr-forced"
                      >
                        {sub.githubLink}
                      </a>
                    </div>
                    <p className="text-slate-700 font-sans text-xs pt-1">
                      <strong>{isRTL ? 'الشرح:' : 'Explanation:'}</strong> {sub.explanation}
                    </p>
                  </div>

                  {/* Feedback block */}
                  {sub.status === 'feedback_given' && (
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-teal-900 font-bold text-xs sm:text-sm">
                        <span>{isRTL ? 'ملاحظات المرشد المعتمد' : 'Mentor Review & Feedback'}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-teal-800">
                        {isRTL
                          ? 'عمل ممتاز! تم استيفاء الشروط الأساسية واختبار المدخلات بشكل ملائم.'
                          : 'Excellent work! The input validation and currency formatting are well implemented.'}
                      </p>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => handleAcceptFeedback(sub.id)}
                          className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs inline-flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isRTL ? 'قبول الملاحظات وإنهاء المهمة' : 'Accept Feedback & Complete'}</span>
                        </button>

                        <button
                          onClick={() => handleEscalateToTeacher(sub.id)}
                          className="px-3 py-1.5 rounded-lg bg-white border border-teal-300 text-teal-900 font-semibold text-xs hover:bg-teal-100"
                        >
                          <span>{isRTL ? 'اعتراض وتصعيد للأستاذ' : 'Disagree & Request Teacher Review'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {sub.status === 'revision_requested' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
                        <AlertCircle className="w-4 h-4 text-amber-700" />
                        <span>{isRTL ? 'مطلوب تعديل وإعادة تقديم' : 'Revision Required by Reviewer'}</span>
                      </div>
                      <p className="text-xs text-amber-800">
                        {isRTL
                          ? 'يرجى مراجعة معالجة الأرقام العشرية والتأكد من توثيق ملف README.'
                          : 'Please revise the error handling and ensure the README.md has instructions.'}
                      </p>

                      <Link
                        to={`/project/${sub.topicId}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isRTL ? 'إعادة التقديم (محاولة جديدة)' : 'Resubmit Revision'}</span>
                      </Link>
                    </div>
                  )}

                  {sub.status === 'escalated' && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs sm:text-sm text-rose-900 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>{isRTL ? 'قيد المراجعة المباشرة من أستاذ المقرر' : 'Under Direct Teacher Escalation'}</strong>
                        <p className="text-xs text-rose-700 mt-0.5">
                          {isRTL
                            ? 'تمت إحالة هذا المشروع إلى الأستاذ لإصدار القرار النهائي.'
                            : 'This submission has been referred to the Course Lead (Teacher) for resolution.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
