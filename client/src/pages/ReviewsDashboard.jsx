import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LESSONS, TOPICS, INITIAL_SUBMISSIONS } from '../data/mockData';
import StatusBadge from '../components/common/StatusBadge';
import { 
  CheckSquare, 
  Send, 
  RotateCcw, 
  AlertTriangle, 
  ShieldAlert, 
  ExternalLink, 
  MessageSquare, 
  UserCheck 
} from 'lucide-react';
import GithubIcon from '../components/common/GithubIcon';

export default function ReviewsDashboard() {
  const { t, isRTL, language } = useLanguage();
  const { currentUser, isTeacher, isMentor } = useAuth();
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  // Check if current user is authorized to review this submission (BR-3 & BR-4)
  const canReview = (sub) => {
    // Cannot review own submission (BR-4)
    if (sub.learnerId === currentUser?.id) return false;

    // Teacher can review all submissions
    if (isTeacher) return true;

    // Mentor can review only if approved for the topic (BR-3)
    if (isMentor) {
      const topicId = sub.topicId || LESSONS.find((l) => l.id === sub.lessonId)?.topicId;
      const isApprovedForTopic = currentUser?.approvedTopics?.includes(topicId);
      return Boolean(isApprovedForTopic);
    }

    return false;
  };

  const handleGiveFeedback = (subId) => {
    if (!feedbackText.trim()) return;
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? {
              ...sub,
              status: 'feedback_given',
              feedbacks: [
                ...sub.feedbacks,
                { author: currentUser.name, text: feedbackText, date: new Date().toISOString() },
              ],
            }
          : sub
      )
    );
    setActiveReviewId(null);
    setFeedbackText('');
  };

  const handleRequestRevision = (subId) => {
    if (!feedbackText.trim()) return;
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? {
              ...sub,
              status: 'revision_requested',
              feedbacks: [
                ...sub.feedbacks,
                { author: currentUser.name, text: feedbackText, date: new Date().toISOString() },
              ],
            }
          : sub
      )
    );
    setActiveReviewId(null);
    setFeedbackText('');
  };

  const handleEscalate = (subId) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === subId ? { ...sub, status: 'escalated' } : sub))
    );
    setActiveReviewId(null);
    setFeedbackText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isRTL ? 'لوحة تقييم ومراجعة الواجبات' : 'Assignment Review Dashboard'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {isTeacher ? 'Teacher View (All)' : 'Mentor View (Topic-Scoped)'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isRTL
              ? 'تقييم تسليمات الطلاب للوحدات المعتمدة، طلب التعديلات، وتصعيد الحالات المعقدة'
              : 'Evaluate submissions for approved topics, request revisions, and escalate complex cases.'}
          </p>
        </div>

        {isMentor && (
          <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs flex items-center gap-2 shadow-sm">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="font-semibold text-slate-700">
                {isRTL ? 'المواضيع المعتمدة لك:' : 'Your Approved Topics:'}
              </span>{' '}
              <span className="text-emerald-700 font-bold">
                {currentUser?.approvedTopics?.join(', ') || 'None'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Submissions Queue */}
      <div className="space-y-6">
        {submissions.map((sub) => {
          const topic = TOPICS.find((t) => t.id === (sub.topicId || LESSONS.find((l) => l.id === sub.lessonId)?.topicId));
          const authorized = canReview(sub);
          const isReviewing = activeReviewId === sub.id;

          return (
            <div
              key={sub.id}
              className={`bg-white rounded-2xl border p-6 space-y-5 transition-shadow shadow-sm ${
                authorized ? 'border-slate-200 hover:border-slate-300' : 'border-slate-200 bg-slate-50/70 opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {language === 'ar' ? topic?.titleAr : topic?.titleEn}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {language === 'ar'
                        ? sub.assignmentTitleAr || topic?.assignment?.titleAr
                        : sub.assignmentTitleEn || topic?.assignment?.titleEn}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    {isRTL ? 'الطالب:' : 'Learner:'}{' '}
                    <strong className="text-slate-700">{sub.learnerName}</strong> •{' '}
                    {isRTL ? `المحاولة #${sub.attemptNo}` : `Attempt #${sub.attemptNo}`}
                  </p>
                </div>

                <StatusBadge status={sub.status} />
              </div>

              {/* Code link and explanation */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <GithubIcon className="w-4 h-4 text-slate-800" />
                    <span className="font-semibold text-slate-700">Repository:</span>
                    <a
                      href={sub.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline ltr-forced"
                    >
                      {sub.githubLink}
                    </a>
                  </div>
                  <a
                    href={sub.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900"
                  >
                    <span>{isRTL ? 'فتح GitHub' : 'Open in GitHub'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="pt-1 text-slate-700">
                  <strong className="block text-slate-900 mb-0.5">{isRTL ? 'شرح الطالب:' : "Learner's Explanation:"}</strong>
                  <p className="leading-relaxed">{sub.explanation}</p>
                </div>
              </div>

              {/* Authorization check message */}
              {!authorized && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    {isRTL
                      ? 'لا تملك صلاحية مراجعة هذا الواجب. (يتطلب اعتماد الأستاذ للموضوع أو عدم مراجعة واجباتك الخاصة).'
                      : 'You are not authorized to review this submission per teacher approval constraints (BR-3 & BR-4).'}
                  </span>
                </div>
              )}

              {/* Review Actions if authorized */}
              {authorized && !isReviewing && sub.status !== 'complete' && (
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveReviewId(sub.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{isRTL ? 'كتابة تقييم وملاحظات' : 'Start Review'}</span>
                  </button>

                  <button
                    onClick={() => handleEscalate(sub.id)}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs inline-flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{isRTL ? 'تصعيد للأستاذ' : 'Escalate to Teacher'}</span>
                  </button>
                </div>
              )}

              {/* Interactive Review Box */}
              {isReviewing && (
                <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-5 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">
                    {isRTL ? 'كتابة ملاحظات المراجعة والتقييم' : 'Review & Evaluation Feedback'}
                  </h4>

                  <textarea
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder={
                      isRTL
                        ? 'اكتب ملاحظاتك التوجيهية، ما تميز به الكود، وما يحتاج إلى تحسين أو تصحيح...'
                        : 'Write actionable feedback for the learner...'
                    }
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  ></textarea>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleGiveFeedback(sub.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isRTL ? 'إرسال الملاحظات (مقبول)' : 'Submit Feedback'}</span>
                      </button>

                      <button
                        onClick={() => handleRequestRevision(sub.id)}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isRTL ? 'طلب مراجعة وتعديل' : 'Request Revision'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEscalate(sub.id)}
                        className="px-3 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold text-xs inline-flex items-center gap-1"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{isRTL ? 'تصعيد للأستاذ' : 'Escalate'}</span>
                      </button>

                      <button
                        onClick={() => setActiveReviewId(null)}
                        className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-semibold text-xs"
                      >
                        {t.common.cancel}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
