import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LESSONS, TOPICS, INITIAL_SUBMISSIONS } from '../data/mockData';
import { api } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import RevisionTimeline from '../components/common/RevisionTimeline';
import { 
  CheckSquare, 
  Send, 
  RotateCcw, 
  AlertTriangle, 
  ShieldAlert, 
  ExternalLink, 
  MessageSquare, 
  UserCheck,
  History,
  CheckCircle,
  FolderGit2
} from 'lucide-react';
import GithubIcon from '../components/common/GithubIcon';

const FILTER_TABS = [
  { id: 'all', labelEn: 'All', labelAr: 'الكل' },
  { id: 'pending', labelEn: 'Pending Review', labelAr: 'قيد المراجعة' },
  { id: 'revision_requested', labelEn: 'Revision Requested', labelAr: 'تعديل مطلوب' },
  { id: 'escalated', labelEn: 'Escalated', labelAr: 'مُصعَّد للأستاذ' },
  { id: 'complete', labelEn: 'Completed', labelAr: 'مكتملة' },
];

const AVAILABLE_REVIEWERS = [
  { id: 'usr-teacher-1', nameEn: 'Dr. Tariq Ahmed (Teacher)', nameAr: 'د. طارق أحمد (أستاذ المقرر)' },
  { id: 'usr-mentor-1', nameEn: 'Sarah Ibrahim (Mentor)', nameAr: 'سارة إبراهيم (مرشدة)' },
  { id: 'usr-mentor-2', nameEn: 'Omar Farouk (Mentor)', nameAr: 'عمر فاروق (مرشد)' },
  { id: 'usr-mentor-3', nameEn: 'Mona Elhassan (Mentor)', nameAr: 'منى الحسن (مرشدة)' },
];

export default function ReviewsDashboard() {
  const { t, isRTL, language } = useLanguage();
  const { currentUser, isTeacher, isMentor } = useAuth();
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    async function loadLiveSubmissions() {
      try {
        const data = await api.getSubmissions();
        if (data.submissions && data.submissions.length > 0) {
          const mapped = data.submissions.map((s) => ({
            id: s.id,
            topicId: s.topic_id,
            learnerId: s.learner_id,
            learnerName: s.learner_name,
            githubLink: s.github_link,
            explanation: s.explanation,
            attemptNo: s.attempt_no,
            status: s.status,
            submittedAt: s.submitted_at,
            assignmentTitleEn: s.topic_title_en,
            assignmentTitleAr: s.topic_title_ar,
            assignedMentorId: s.assigned_mentor_id,
            assignedMentorName: s.assigned_mentor_name,
            feedbacks: (s.feedbacks || []).map((f) => ({
              author: f.author_name,
              text: f.comment,
              date: f.created_at,
            })),
          }));
          setSubmissions(mapped);
        }
      } catch (err) {
        // Local preview fallback
      }
    }
    loadLiveSubmissions();
  }, []);

  // Check if current user is authorized to review this submission
  const canReview = (sub) => {
    // Cannot review own submission
    if (sub.learnerId === currentUser?.id) return false;

    // Teacher can review all submissions
    if (isTeacher) return true;

    // Mentor can review only if approved for the topic
    if (isMentor) {
      const topicId = sub.topicId || LESSONS.find((l) => l.id === sub.lessonId)?.topicId;
      const isApprovedForTopic = currentUser?.approvedTopics?.includes(topicId);
      return Boolean(isApprovedForTopic);
    }

    return false;
  };

  const handleGiveFeedback = async (subId) => {
    if (!feedbackText.trim()) return;
    const comment = feedbackText.trim();
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? {
              ...sub,
              status: 'feedback_given',
              feedbacks: [
                ...sub.feedbacks,
                { author: currentUser.name, text: comment, date: new Date().toISOString() },
              ],
            }
          : sub
      )
    );
    setActiveReviewId(null);
    setFeedbackText('');

    try {
      await api.submitFeedback(subId, {
        authorId: currentUser.id,
        comment,
        action: 'approve',
      });
    } catch (err) {
      // Graceful offline fallback
    }
  };

  const handleRequestRevision = async (subId) => {
    if (!feedbackText.trim()) return;
    const comment = feedbackText.trim();
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? {
              ...sub,
              status: 'revision_requested',
              feedbacks: [
                ...sub.feedbacks,
                { author: currentUser.name, text: comment, date: new Date().toISOString() },
              ],
            }
          : sub
      )
    );
    setActiveReviewId(null);
    setFeedbackText('');

    try {
      await api.submitFeedback(subId, {
        authorId: currentUser.id,
        comment,
        action: 'request_revision',
      });
    } catch (err) {
      // Graceful offline fallback
    }
  };

  const handleEscalate = async (subId) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === subId ? { ...sub, status: 'escalated' } : sub))
    );
    setActiveReviewId(null);
    setFeedbackText('');

    try {
      await api.submitFeedback(subId, {
        authorId: currentUser.id,
        comment: 'Escalated by mentor for course lead review.',
        action: 'escalate',
      });
    } catch (err) {
      // Graceful offline fallback
    }
  };

  const handleAssignReviewer = async (subId, mentorId) => {
    if (!mentorId) return;

    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? {
              ...sub,
              assignedMentorId: mentorId,
              status: sub.status === 'submitted' ? 'under_review' : sub.status,
            }
          : sub
      )
    );

    const found = INITIAL_SUBMISSIONS.find((s) => s.id === subId);
    if (found) {
      found.assignedMentorId = mentorId;
      if (found.status === 'submitted') {
        found.status = 'under_review';
      }
    }

    try {
      await api.assignReviewer(subId, {
        teacherId: currentUser.id,
        mentorId,
      });
    } catch (err) {
      // Graceful offline fallback
    }
  };

  const handleResolveEscalation = async (subId, resolution, comment) => {
    const nextStatus = resolution === 'complete' ? 'complete' : 'revision_requested';

    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? {
              ...sub,
              status: nextStatus,
              feedbacks: [
                ...sub.feedbacks,
                {
                  author: currentUser?.name || 'Dr. Tariq Ahmed',
                  text: comment,
                  date: new Date().toISOString(),
                },
              ],
            }
          : sub
      )
    );

    const found = INITIAL_SUBMISSIONS.find((s) => s.id === subId);
    if (found) {
      found.status = nextStatus;
      found.feedbacks.push({
        author: currentUser?.name || 'Dr. Tariq Ahmed',
        text: comment,
        date: new Date().toISOString(),
      });
    }

    try {
      await api.resolveEscalation(subId, {
        teacherId: currentUser.id,
        resolution,
        comment,
      });
    } catch (err) {
      // Graceful offline fallback
    }
  };

  // Tab counters
  const getTabCount = (tabId) => {
    if (tabId === 'all') return submissions.length;
    if (tabId === 'pending') {
      return submissions.filter((s) => s.status === 'submitted' || s.status === 'under_review').length;
    }
    if (tabId === 'revision_requested') {
      return submissions.filter((s) => s.status === 'revision_requested').length;
    }
    if (tabId === 'escalated') {
      return submissions.filter((s) => s.status === 'escalated').length;
    }
    if (tabId === 'complete') {
      return submissions.filter((s) => s.status === 'complete' || s.status === 'feedback_given').length;
    }
    return 0;
  };

  // Filtered submissions
  const filteredSubmissions = submissions.filter((sub) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return sub.status === 'submitted' || sub.status === 'under_review';
    if (activeFilter === 'revision_requested') return sub.status === 'revision_requested';
    if (activeFilter === 'escalated') return sub.status === 'escalated';
    if (activeFilter === 'complete') return sub.status === 'complete' || sub.status === 'feedback_given';
    return true;
  });

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
              {isTeacher
                ? isRTL ? 'عرض الأستاذ (شامل)' : 'Teacher View (All)'
                : isRTL ? 'عرض المرشد (مخصص للوحدات المعتمدة)' : 'Mentor View (Topic-Scoped)'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isRTL
              ? 'تقييم تسليمات الطلاب للوحدات المعتمدة، طلب التعديلات، وتصعيد الحالات المعقدة'
              : 'Evaluate submissions for approved topics, request revisions, and escalate complex cases.'}
          </p>
        </div>

        {isMentor && (
          <div className="bg-white dark:bg-[#151d30] border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs flex flex-wrap items-center gap-2 shadow-sm">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 shrink-0">
              <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isRTL ? 'المواضيع المعتمدة لك:' : 'Your Approved Topics:'}</span>
            </div>
            {currentUser?.approvedTopics && currentUser.approvedTopics.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {currentUser.approvedTopics.map((topId) => {
                  const topic = TOPICS.find((t) => t.id === topId);
                  const title = topic
                    ? isRTL ? (topic.titleAr || topic.titleEn) : (topic.titleEn || topic.titleAr)
                    : topId;
                  return (
                    <span
                      key={topId}
                      className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-md font-bold text-[11px]"
                    >
                      {title}
                    </span>
                  );
                })}
              </div>
            ) : (
              <span className="text-slate-400 dark:text-slate-500 italic">
                {isRTL ? 'لا توجد مواضيع معتمدة حالياً' : 'None'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        {FILTER_TABS.map((tab) => {
          const count = getTabCount(tab.id);
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
              }`}
            >
              <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  isActive ? 'bg-emerald-700/80 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Submissions Queue */}
      <div className="space-y-6">
        {filteredSubmissions.length === 0 ? (
          <div className="bg-white dark:bg-[#151d30] border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3 shadow-xs">
            <FolderGit2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {isRTL ? 'لا توجد تسليمات في هذا التبويب حالياً' : 'No submissions found in this category'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {isRTL
                ? 'يمكنك تغيير التبويب المختار لعرض التسليمات الأخرى أو متابعة لوحة التحكم.'
                : 'Try selecting another filter tab to view submissions across other review stages.'}
            </p>
          </div>
        ) : (
          filteredSubmissions.map((sub) => {
            const topic = TOPICS.find((t) => t.id === (sub.topicId || LESSONS.find((l) => l.id === sub.lessonId)?.topicId));
            const authorized = canReview(sub);
            const isReviewing = activeReviewId === sub.id;

            return (
              <div
                key={sub.id}
                className={`bg-white dark:bg-[#151d30] rounded-2xl border p-6 space-y-5 transition-shadow shadow-sm ${
                  authorized ? 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700' : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {language === 'ar' ? topic?.titleAr : topic?.titleEn}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {language === 'ar'
                          ? sub.assignmentTitleAr || topic?.assignment?.titleAr
                          : sub.assignmentTitleEn || topic?.assignment?.titleEn}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isRTL ? 'الطالب:' : 'Learner:'}{' '}
                      <strong className="text-slate-700 dark:text-slate-200">{sub.learnerName}</strong> •{' '}
                      {isRTL ? `المحاولة #${sub.attemptNo}` : `Attempt #${sub.attemptNo}`}
                    </p>
                  </div>

                  <StatusBadge status={sub.status} />
                </div>

                {/* Code link and explanation */}
                <div className="bg-slate-50 dark:bg-slate-900/60 border border-transparent dark:border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <GithubIcon className="w-4 h-4 text-slate-800 dark:text-slate-200" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{isRTL ? 'المستودع:' : 'Repository:'}</span>
                      <a
                        href={sub.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 dark:text-emerald-400 hover:underline ltr-forced"
                      >
                        {sub.githubLink}
                      </a>
                    </div>
                    <a
                      href={sub.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    >
                      <span>{isRTL ? 'فتح GitHub' : 'Open in GitHub'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="pt-1 text-slate-700 dark:text-slate-300">
                    <strong className="block text-slate-900 dark:text-slate-100 mb-0.5">{isRTL ? 'شرح الطالب:' : "Learner's Explanation:"}</strong>
                    <p className="leading-relaxed">{sub.explanation}</p>
                  </div>
                </div>

                {/* Assigned Reviewer bar */}
                <div className="bg-slate-50/70 dark:bg-slate-900/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      {isRTL ? 'المراجع المكلف:' : 'Assigned Reviewer:'}
                    </span>
                    {sub.assignedMentorId ? (
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-md">
                        {language === 'ar'
                          ? AVAILABLE_REVIEWERS.find((r) => r.id === sub.assignedMentorId)?.nameAr || sub.assignedMentorName || sub.assignedMentorId
                          : AVAILABLE_REVIEWERS.find((r) => r.id === sub.assignedMentorId)?.nameEn || sub.assignedMentorName || sub.assignedMentorId}
                      </span>
                    ) : (
                      <span className="text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2.5 py-0.5 rounded-md font-semibold">
                        {isRTL ? 'غير مُعين (بانتظار تكليف الأستاذ)' : 'Unassigned (Awaiting Assignment)'}
                      </span>
                    )}
                  </div>

                  {/* Teacher Assign Dropdown */}
                  {isTeacher && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
                        {isRTL ? 'تكليف مراجع:' : 'Assign To:'}
                      </span>
                      <select
                        value={sub.assignedMentorId || ''}
                        onChange={(e) => handleAssignReviewer(sub.id, e.target.value)}
                        className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                      >
                        <option value="">{isRTL ? '-- اختر مراجعاً --' : '-- Select Reviewer --'}</option>
                        {AVAILABLE_REVIEWERS.map((r) => (
                          <option key={r.id} value={r.id}>
                            {language === 'ar' ? r.nameAr : r.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Teacher Resolve Escalation Panel */}
                {isTeacher && sub.status === 'escalated' && (
                  <div className="bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-purple-700 dark:text-purple-400 shrink-0" />
                        <h5 className="font-bold text-xs text-purple-950 dark:text-purple-200">
                          {isRTL ? 'إجراءات أستاذ المقرر لفض الحالة المُصعَّدة:' : 'Course Lead Escalation Resolution:'}
                        </h5>
                      </div>
                      <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800/60">
                        {isRTL ? 'صلاحية الأستاذ فقط' : 'Teacher Authority Only'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleResolveEscalation(
                            sub.id,
                            'complete',
                            isRTL
                              ? 'تم فض التصعيد واعتماد المشروع نهائياً بواسطة أستاذ المادة.'
                              : 'Escalation resolved and project approved by course lead.'
                          )
                        }
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>{isRTL ? 'اعتماد المشروع كـ مكتمل' : 'Approve & Mark Complete'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleResolveEscalation(
                            sub.id,
                            'revision_requested',
                            isRTL
                              ? 'طلب أستاذ المادة من الطالب تصحيح المتطلبات وإعادة الرفع.'
                              : 'Course lead requested revision with updated requirements.'
                          )
                        }
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isRTL ? 'طلب تعديل ومراجعة من الطالب' : 'Request Revision'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Authorization check message */}
                {!authorized && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 rounded-xl text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>
                      {isRTL
                        ? 'لا تملك صلاحية مراجعة هذا الواجب. (يتطلب اعتماد الأستاذ للموضوع أو عدم مراجعة واجباتك الخاصة).'
                        : 'You are not authorized to review this submission per teacher approval constraints.'}
                    </span>
                  </div>
                )}

                {/* Review Actions if authorized */}
                {authorized && !isReviewing && sub.status !== 'complete' && (
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveReviewId(sub.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{isRTL ? 'كتابة تقييم وملاحظات' : 'Start Review'}</span>
                    </button>

                    {sub.status !== 'escalated' && (
                      <button
                        onClick={() => handleEscalate(sub.id)}
                        className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>{isRTL ? 'تصعيد للأستاذ' : 'Escalate to Teacher'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setExpandedHistoryId(expandedHistoryId === sub.id ? null : sub.id)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <History className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>
                        {expandedHistoryId === sub.id
                          ? isRTL ? 'إخفاء سجل المحاولات' : 'Hide History'
                          : isRTL ? 'سجل المحاولات والنسخ' : 'View Attempt History'}
                      </span>
                    </button>
                  </div>
                )}

                {/* Revision History Timeline */}
                {expandedHistoryId === sub.id && (
                  <div className="pt-2">
                    <RevisionTimeline
                      attempts={submissions.filter(
                        (s) => (s.topicId || s.lessonId) === (sub.topicId || sub.lessonId) && s.learnerId === sub.learnerId
                      )}
                    />
                  </div>
                )}

                {/* Interactive Review Box */}
                {isReviewing && (
                  <div className="border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/30 rounded-xl p-5 space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
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
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100"
                    ></textarea>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleGiveFeedback(sub.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isRTL ? 'إرسال الملاحظات (مقبول)' : 'Submit Feedback'}</span>
                        </button>

                        <button
                          onClick={() => handleRequestRevision(sub.id)}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{isRTL ? 'طلب مراجعة وتعديل' : 'Request Revision'}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {sub.status !== 'escalated' && (
                          <button
                            onClick={() => handleEscalate(sub.id)}
                            className="px-3 py-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-300 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{isRTL ? 'تصعيد للأستاذ' : 'Escalate'}</span>
                          </button>
                        )}

                        <button
                          onClick={() => setActiveReviewId(null)}
                          className="px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 font-semibold text-xs cursor-pointer"
                        >
                          {t.common.cancel}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
