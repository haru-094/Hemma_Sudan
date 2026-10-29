import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useSync } from '../context/SyncContext';
import { LESSONS, INITIAL_SUBMISSIONS } from '../data/mockData';
import { 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  AlertTriangle, 
  CheckCircle, 
  FileCode, 
  Info 
} from 'lucide-react';
import GithubIcon from '../components/common/GithubIcon';

export default function SubmissionPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { t, isRTL, language } = useLanguage();
  const { currentUser } = useAuth();
  const { isOnline } = useSync();

  const lesson = LESSONS.find((l) => l.id === lessonId) || LESSONS[0];

  const [githubLink, setGithubLink] = useState('');
  const [explanation, setExplanation] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const ArrowBackIcon = isRTL ? ArrowRight : ArrowLeft;

  // Validate GitHub link format (FR-6.3)
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

    // Check online requirement (FR-6.4)
    if (!isOnline) {
      setErrorMsg(
        isRTL
          ? 'لا يمكن تقديم الواجب أثناء وضع عدم الاتصال. يرجى الانتظار حتى عودة الاتصال بالإنترنت.'
          : 'Submissions are rejected while offline. Please connect to the internet to submit your assignment.'
      );
      return;
    }

    // Validate link
    if (!isValidGithubUrl(githubLink)) {
      setErrorMsg(
        isRTL
          ? 'يرجى إدخال رابط مستودع GitHub صحيح (مثال: https://github.com/username/repository)'
          : 'Please enter a valid, reachable GitHub repository link (e.g., https://github.com/username/repository).'
      );
      return;
    }

    if (!explanation.trim() || explanation.trim().length < 15) {
      setErrorMsg(
        isRTL
          ? 'يرجى تقديم شرح موجز وواضح لمنهجية حلك والشيفرة المكتوبة (15 حرفاً كحد أدنى).'
          : 'Please provide a clear explanation of your implementation and solution (minimum 15 characters).'
      );
      return;
    }

    // In step 1 mock flow: add submission to state and navigate to dashboard
    const newSubmission = {
      id: `sub-${Date.now()}`,
      lessonId: lesson.id,
      learnerId: currentUser?.id || 'usr-learner-1',
      learnerName: currentUser?.name || 'Ahmed Osman',
      githubLink: githubLink.trim(),
      explanation: explanation.trim(),
      attemptNo: 1,
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link
          to={`/lessons/${lesson.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowBackIcon className="w-4 h-4" />
          <span>{t.common.back}</span>
        </Link>

        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
          {isRTL ? 'تقديم الواجب البرمجي' : 'Submit Assignment'}
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {language === 'ar' ? lesson.titleAr : lesson.titleEn}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {language === 'ar' ? lesson.assignmentPromptAr : lesson.assignmentPromptEn}
        </p>
      </div>

      {/* Online Requirement Callout */}
      {!isOnline && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <strong className="block font-semibold">
              {isRTL ? 'الاتصال بالإنترنت مطلوب' : 'Active Internet Connection Required'}
            </strong>
            <span>
              {isRTL
                ? 'وفقاً لمتطلبات النظام (FR-6.4)، يجب توفر اتصال نشط لرفع رابط المستودع ومشاركته مع المرشد.'
                : 'Per SRS FR-6.4, code submissions require an active internet connection and cannot be queued offline.'}
            </span>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            {isRTL
              ? 'تم تقديم الواجب بنجاح! جاري الانتقال إلى لوحة التحكم...'
              : 'Assignment submitted successfully! Redirecting to your dashboard...'}
          </span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
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
              placeholder="https://github.com/username/project"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-mono ltr-forced"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {isRTL
              ? 'تأكد من أن المستودع عام (Public) ليتمكن المرشد أو الأستاذ من مراجعته.'
              : 'Make sure your repository is public so authorized reviewers can inspect your code.'}
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-bold text-slate-900">
            {isRTL ? 'شرح الحل والتنفيذ' : 'Solution Explanation'}
            <span className="text-rose-500 mx-1">*</span>
          </label>
          <textarea
            rows={5}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder={
              isRTL
                ? 'اشرح كيف قمت بحل المسألة، المتغيرات المستخدمة، وأي تحديات واجهتك...'
                : 'Explain how you structured the solution, logic choices, and any testing performed...'
            }
            required
            className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm leading-relaxed"
          ></textarea>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={!isOnline || isSuccess}
            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
              isOnline && !isSuccess
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{isRTL ? 'إرسال الواجب للمراجعة' : 'Submit for Review'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
