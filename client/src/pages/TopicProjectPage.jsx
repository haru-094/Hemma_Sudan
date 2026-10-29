import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useSync } from '../context/SyncContext';
import { TOPICS, INITIAL_SUBMISSIONS } from '../data/mockData';
import GithubIcon from '../components/common/GithubIcon';
import StatusBadge from '../components/common/StatusBadge';
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
  ExternalLink
} from 'lucide-react';

export default function TopicProjectPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { t, isRTL, language } = useLanguage();
  const { currentUser } = useAuth();
  const { isOnline } = useSync();

  const topic = TOPICS.find((top) => top.id === topicId) || TOPICS[0];
  const existingSubmissions = INITIAL_SUBMISSIONS.filter(
    (s) => s.topicId === topic.id && s.learnerId === currentUser?.id
  );
  const latestSub = existingSubmissions[existingSubmissions.length - 1];

  const [githubLink, setGithubLink] = useState('');
  const [explanation, setExplanation] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleSubmit = (e) => {
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
    setIsSuccess(true);
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
      {latestSub && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              {isRTL ? `آخر محاولة تقديم: #${latestSub.attemptNo}` : `Latest Submission: Attempt #${latestSub.attemptNo}`}
            </span>
            <StatusBadge status={latestSub.status} />
          </div>

          <div className="bg-slate-50 rounded-lg p-3 text-xs font-mono space-y-1">
            <div className="flex items-center gap-2">
              <GithubIcon className="w-3.5 h-3.5 text-slate-700" />
              <a
                href={latestSub.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:underline ltr-forced"
              >
                {latestSub.githubLink}
              </a>
            </div>
            <p className="font-sans text-slate-600 pt-1">
              <strong>{isRTL ? 'الشرح:' : 'Explanation:'}</strong> {latestSub.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Submission Form (Online Only) */}
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
              disabled={!isOnline || isSuccess}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                isOnline && !isSuccess
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{isRTL ? 'إرسال المشروع للتقييم' : 'Submit for Mentor Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

