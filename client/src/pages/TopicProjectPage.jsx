import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useSync } from '../context/SyncContext';
import { TOPICS, INITIAL_SUBMISSIONS } from '../data/mockData';
import { api } from '../services/api';
import GithubIcon from '../components/common/GithubIcon';
import StatusBadge from '../components/common/StatusBadge';
import RevisionTimeline from '../components/common/RevisionTimeline';
import { 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  AlertTriangle, 
  CheckCircle, 
  RotateCcw,
  Check,
  FileCode,
  FolderGit2,
  ExternalLink,
  HelpCircle,
  ShieldAlert,
  MessageSquare,
  Loader2
} from 'lucide-react';

export default function TopicProjectPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { t, isRTL, language } = useLanguage();
  const { currentUser } = useAuth();
  const { isOnline } = useSync();

  const topic = TOPICS.find((top) => top.id === topicId) || TOPICS[0];
  const [submissions, setSubmissions] = useState(() =>
    INITIAL_SUBMISSIONS.filter(
      (s) => s.topicId === topic.id && s.learnerId === (currentUser?.id || 'usr-learner-1')
    )
  );

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await api.getSubmissionHistory(topic.id, currentUser?.id || 'usr-learner-1');
        if (data && data.history && data.history.length > 0) {
          const mapped = data.history.map((s) => ({
            id: s.id,
            topicId: s.topic_id,
            assignmentTitleEn: s.topic_title_en,
            assignmentTitleAr: s.topic_title_ar,
            learnerId: s.learner_id,
            learnerName: currentUser?.name || 'Ahmed Osman',
            githubLink: s.github_link,
            explanation: s.explanation,
            attemptNo: s.attempt_no,
            status: s.status,
            submittedAt: s.submitted_at,
            assignedMentorId: s.assigned_mentor_id,
            feedbacks: (s.feedbacks || []).map((f) => ({
              author: f.author_name || 'Mentor',
              text: f.comment,
              date: f.created_at,
            })),
          }));
          setSubmissions(mapped);
        }
      } catch (err) {
        // Fallback to local state
      }
    }
    loadHistory();
  }, [topic.id, currentUser?.id]);

  const latestSub = submissions[submissions.length - 1];

  const [githubLink, setGithubLink] = useState('');
  const [explanation, setExplanation] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidatingGithub, setIsValidatingGithub] = useState(false);

  const ArrowBackIcon = isRTL ? ArrowRight : ArrowLeft;

  const isValidGithubUrl = (url) => {
    try {
      const parsed = new URL(url.trim());
      return (
        (parsed.hostname === 'github.com' || parsed.hostname === 'www.github.com') &&
        parsed.pathname.split('/').filter(Boolean).length >= 2
      );
    } catch {
      return false;
    }
  };

  const handleRequestTeacherReview = async (subId, reason) => {
    const feedbackRemark = {
      author: currentUser?.name || 'Ahmed Osman',
      text: reason || (isRTL ? 'طلب الطالب مراجعة أستاذ المقرر مباشرة.' : 'Learner requested direct review from course lead.'),
      date: new Date().toISOString(),
    };

    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? {
              ...sub,
              status: 'escalated',
              feedbacks: [...sub.feedbacks, feedbackRemark],
            }
          : sub
      )
    );

    const found = INITIAL_SUBMISSIONS.find((s) => s.id === subId);
    if (found) {
      found.status = 'escalated';
      found.feedbacks.push(feedbackRemark);
    }

    try {
      await api.requestTeacherReview(subId, {
        learnerId: currentUser?.id || 'usr-learner-1',
        reason,
      });
    } catch (err) {
      // Offline / demo fallback
    }
  };

  const handleAcceptFeedback = async (subId) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === subId ? { ...sub, status: 'complete' } : sub))
    );

    const found = INITIAL_SUBMISSIONS.find((s) => s.id === subId);
    if (found) {
      found.status = 'complete';
    }

    try {
      await api.resolveEscalation(subId, {
        teacherId: currentUser?.id || 'usr-teacher-1',
        resolution: 'complete',
        comment: 'Accepted by learner.',
      });
    } catch (err) {
      // Offline / demo fallback
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isOnline) {
      setErrorMsg(
        isRTL
          ? 'لا يمكن رفع الواجب أثناء عدم الاتصال. يرجى الانتظار حتى عودة الإنترنت.'
          : 'Submissions are rejected while offline. Please connect to the internet to submit your repository.'
      );
      return;
    }

    if (!isValidGithubUrl(githubLink)) {
      setErrorMsg(
        isRTL
          ? 'يرجى إدخال رابط مستودع GitHub صحيح (مثال: https://github.com/username/project)'
          : 'Please enter a valid, reachable GitHub repository link (e.g., https://github.com/username/project).'
      );
      return;
    }

    if (!explanation.trim() || explanation.trim().length < 15) {
      setErrorMsg(
        isRTL
          ? 'يرجى كتابة شرح واضح للمنهجية والحل (15 حرفاً على الأقل).'
          : 'Please provide a clear explanation of your solution (minimum 15 characters).'
      );
      return;
    }

    // FR-6.3: Reachability probe check
    setIsValidatingGithub(true);
    try {
      const probe = await api.validateGithubRepo({ githubLink: githubLink.trim() });
      if (probe && probe.reachable === false) {
        setErrorMsg(
          isRTL
            ? 'المستودع غير موجود أو أنه خاص. يرجى التأكد من أن المستودع عام ويمكن الوصول إليه (FR-6.3).'
            : (probe.message || 'Repository not found or is private — please ensure your repository is public and reachable (FR-6.3).')
        );
        setIsValidatingGithub(false);
        return;
      }
    } catch (err) {
      if (err.status === 400 && (err.errorCode === 'REPO_NOT_FOUND' || err.errorCode === 'INVALID_GITHUB_URL' || err.errorCode === 'REPO_UNREACHABLE')) {
        setErrorMsg(
          isRTL
            ? 'المستودع غير موجود أو أنه خاص. يرجى التأكد من أن المستودع عام ويمكن الوصول إليه (FR-6.3).'
            : (err.message || 'Repository not found or is private — please ensure your repository is public and reachable (FR-6.3).')
        );
        setIsValidatingGithub(false);
        return;
      }
    }
    setIsValidatingGithub(false);

    const nextAttempt = latestSub ? latestSub.attemptNo + 1 : 1;
    const newSubmission = {
      id: `sub-${Date.now()}`,
      topicId: topic.id,
      assignmentTitleEn: topic.assignment.titleEn,
      assignmentTitleAr: topic.assignment.titleAr,
      learnerId: currentUser?.id || 'usr-learner-1',
      learnerName: currentUser?.name || 'Ahmed Osman',
      githubLink: githubLink.trim(),
      explanation: explanation.trim(),
      attemptNo: nextAttempt,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      assignedMentorId: null,
      feedbacks: [],
    };

    INITIAL_SUBMISSIONS.push(newSubmission);
    setSubmissions((prev) => [...prev, newSubmission]);
    setIsSuccess(true);

    api.createSubmission({
      topicId: topic.id,
      learnerId: currentUser?.id || 'usr-learner-1',
      githubLink: githubLink.trim(),
      explanation: explanation.trim(),
    }).catch(() => {
      // Local preview fallback
    });

    setTimeout(() => {
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link
          to="/lessons"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowBackIcon className="w-4 h-4" />
          <span>{t.common.back}</span>
        </Link>

        <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
          {isRTL ? `مشروع المحور ${topic.displayOrder}` : `Module ${topic.displayOrder} Capstone`}
        </span>
      </div>

      {/* Project Title and Prompt */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            {language === 'ar' ? topic.titleAr : topic.titleEn}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {language === 'ar' ? topic.assignment.titleAr : topic.assignment.titleEn}
          </h1>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2">
          <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-2">
            {isRTL ? 'متطلبات المشروع البرمجي:' : 'Project Requirements:'}
          </h4>
          <p className="whitespace-pre-line">
            {language === 'ar' ? topic.assignment.promptAr : topic.assignment.promptEn}
          </p>
        </div>
      </div>

      {/* Submission Status or Revision Notice if exists */}
      {submissions.length > 0 && (
        <RevisionTimeline attempts={submissions} />
      )}

      {/* Submission Form & Review Workflows (Online Only) */}
      <div className="space-y-4">
        {!isOnline && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3 text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <strong className="block font-semibold">
                {isRTL ? 'أنت غير متصل بالإنترنت حالياً' : 'You are currently offline'}
              </strong>
              <span>
                {isRTL
                  ? 'يمكنك كتابة الشيفرة وتجربتها في VS Code، والعودة إلى هذه الصفحة لرفع رابط GitHub بمجرد توفر الاتصال.'
                  : 'You can develop your program offline in VS Code, then return to submit your GitHub repository link when online.'}
              </span>
            </div>
          </div>
        )}

        {isSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              {isRTL
                ? 'تم إرسال المشروع بنجاح للمراجعة! جاري نقلك إلى لوحة التحكم...'
                : 'Project submitted successfully for mentor review! Redirecting to dashboard...'}
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1B: Prominent Mentor Revision Remarks Callout (FR-7) */}
        {latestSub?.status === 'revision_requested' && latestSub.feedbacks?.length > 0 && (
          <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-700 shrink-0" />
                <h4 className="text-base font-extrabold text-amber-950">
                  {isRTL ? 'ملاحظات وتوجيهات المرشد للمراجعة والتعديل' : 'Mentor Revision Remarks'}
                </h4>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                {isRTL ? `المحاولة #${latestSub.attemptNo}` : `Attempt #${latestSub.attemptNo}`}
              </span>
            </div>

            {/* Most recent mentor feedback */}
            {(() => {
              const recentFb = latestSub.feedbacks[latestSub.feedbacks.length - 1];
              return (
                <div className="bg-white rounded-xl border border-amber-200 p-4 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <strong className="text-slate-900">{recentFb.author}</strong>
                    </span>
                    <span className="text-slate-400 font-normal">
                      {new Date(recentFb.date).toLocaleDateString(language === 'ar' ? 'ar-SD' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {recentFb.text}
                  </p>
                </div>
              );
            })()}

            {/* Collapsible history if multiple feedbacks exist */}
            {latestSub.feedbacks.length > 1 && (
              <details className="text-xs text-amber-900">
                <summary className="cursor-pointer font-semibold hover:text-amber-950 select-none py-1">
                  {isRTL
                    ? `عرض ${latestSub.feedbacks.length - 1} ملاحظات سابقة`
                    : `View ${latestSub.feedbacks.length - 1} earlier remark(s)`}
                </summary>
                <div className="mt-2 space-y-2 pt-1">
                  {latestSub.feedbacks.slice(0, -1).map((fb, idx) => (
                    <div key={idx} className="bg-white/80 rounded-lg border border-amber-100 p-3 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">{fb.author}</span>
                        <span>{new Date(fb.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-700">{fb.text}</p>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        {/* 2A: Learner Direct Teacher Review Request (FR-10.2) */}
        {latestSub && (latestSub.status === 'submitted' || latestSub.status === 'under_review') && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {isRTL ? 'هل ترغب في طلب مراجعة مباشرة من أستاذ المقرر؟' : 'Need direct review from the course lead?'}
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                {isRTL
                  ? 'إذا لم يتوفر مرشد للموضوع أو كنت بحاجة لتقييم رسمي من أستاذ المادة، يمكنك طلب التدقيق المباشر.'
                  : 'If no mentor is currently assigned or you need formal guidance, you can request course lead evaluation.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleRequestTeacherReview(
                  latestSub.id,
                  isRTL ? 'طلب الطالب مراجعة أستاذ المقرر مباشرة.' : 'Learner requested direct review from course lead.'
                )
              }
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs inline-flex items-center justify-center gap-1.5 shrink-0 shadow-xs transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>{isRTL ? 'طلب مراجعة الأستاذ' : 'Request Teacher Review'}</span>
            </button>
          </div>
        )}

        {/* Feedback Given Decision Banner (FR-10.2 State Machine) */}
        {latestSub && latestSub.status === 'feedback_given' && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-blue-900">
                {isRTL ? 'القرار بشأن تقييم المرشد للمشروع:' : 'Review Evaluation Decision:'}
              </h4>
              <StatusBadge status="feedback_given" />
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              {isRTL
                ? 'قدم المرشد ملاحظاته وتقييمه. يمكنك قبول التقييم واعتماد إكمال الوحدة، أو الاعتراض وطلب مراجعة أستاذ المادة.'
                : 'Feedback has been provided on your project. You can accept and complete this module, or disagree and request teacher review.'}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleAcceptFeedback(latestSub.id)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{isRTL ? 'قبول التقييم وإكمال المشروع' : 'Accept Feedback & Complete'}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleRequestTeacherReview(
                    latestSub.id,
                    isRTL
                      ? 'اعترض الطالب على تقييم المرشد وطلب مراجعة أستاذ المقرر.'
                      : 'Learner disagreed with mentor feedback and requested teacher review.'
                  )
                }
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs inline-flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>{isRTL ? 'الاعتراض وطلب مراجعة الأستاذ' : 'Disagree & Request Teacher Review'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Escalated Notice */}
        {latestSub && latestSub.status === 'escalated' && (
          <div className="bg-purple-50 border border-purple-200 text-purple-900 p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 text-purple-600 shrink-0" />
            <div>
              <strong className="block font-bold">
                {isRTL ? 'الواجب مُصعَّد لمراجعة أستاذ المادة' : 'Escalated to Course Lead'}
              </strong>
              <span>
                {isRTL
                  ? 'تم تحويل تسليمك إلى أستاذ المقرر (د. طارق أحمد) للمراجعة المباشرة والبت النهائي.'
                  : 'Your submission is under review by the course teacher (Dr. Tariq Ahmed) for final evaluation.'}
              </span>
            </div>
          </div>
        )}

        {/* Completed Notice */}
        {latestSub && latestSub.status === 'complete' && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl flex items-center gap-3 text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="block font-bold">
                {isRTL ? 'تهانينا! اكتمل المشروع بنجاح' : 'Congratulations! Project Completed'}
              </strong>
              <span className="text-xs">
                {isRTL
                  ? 'تم اعتماد وقبول مشروع هذه الوحدة. يمكنك متابعة باقي الوحدات التعليمية.'
                  : 'This project has been approved. You can proceed with subsequent course modules.'}
              </span>
            </div>
          </div>
        )}

        {/* Submission Form (Hidden if project is complete) */}
        {latestSub?.status !== 'complete' && (
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              {latestSub?.status === 'revision_requested'
                ? isRTL
                  ? 'تقديم نسخة معدلة جديدة'
                  : 'Submit Revised Project'
                : isRTL
                ? 'إرسال رابط المشروع والملاحظات'
                : 'Submit Project Repository'}
            </h3>

          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-900">
              {isRTL ? 'رابط مستودع GitHub للمشروع' : 'GitHub Repository URL'}
              <span className="text-rose-500 mx-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <GithubIcon className="w-4 h-4" />
              </div>
              <input
                type="url"
                dir="ltr"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                placeholder="https://github.com/username/hemma-module-project"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-mono ltr-forced"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {isRTL
                ? 'تأكد من أن المستودع عام (Public) ويحتوي على الكود وملف README.'
                : 'Ensure your repository is public and contains your source code and documentation.'}
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-900">
              {isRTL ? 'شرح الحل والتصميم البرمجي' : 'Solution & Implementation Explanation'}
              <span className="text-rose-500 mx-1">*</span>
            </label>
            <textarea
              rows={5}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder={
                isRTL
                  ? 'اشرح كيف قمت بحل المسألة، المعاملات، وهيكل البرنامج، والتحديات التي واجهتها...'
                  : 'Describe your program architecture, input handling, and test cases...'
              }
              required
              className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm leading-relaxed"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!isOnline || isSuccess || isValidatingGithub}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                isOnline && !isSuccess && !isValidatingGithub
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isValidatingGithub ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-800" />
                  <span className="text-slate-700">
                    {isRTL
                      ? 'جارٍ التحقق من إمكانية الوصول للمستودع (FR-6.3)...'
                      : 'Verifying Repository Reachability (FR-6.3)...'}
                  </span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{isRTL ? 'إرسال المشروع للتقييم' : 'Submit for Mentor Review'}</span>
                </>
              )}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}

