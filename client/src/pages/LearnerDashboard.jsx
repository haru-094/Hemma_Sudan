import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useSync } from '../context/SyncContext';
import { LESSONS, TOPICS, INITIAL_SUBMISSIONS } from '../data/mockData';
import { api } from '../services/api';
import { RefreshCw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function LearnerDashboard() {
  const { isRTL, language } = useLanguage();
  const { currentUser } = useAuth();
  const { isLessonSaved, triggerSync, isOnline, queueCount } = useSync();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    async function loadLiveLearnerSubmissions() {
      try {
        const data = await api.getSubmissions({ learnerId: currentUser?.id });
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
    loadLiveLearnerSubmissions();
  }, [currentUser?.id]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await triggerSync();
    setTimeout(() => setIsSyncing(false), 800);
  };

  const completedCount = 4; // Mocked / dynamic progress
  const totalLessonsCount = LESSONS.length;
  const savedOfflineCount = LESSONS.filter((l) => isLessonSaved(l.id)).length || 3;
  const waitingSyncCount = queueCount > 0 ? queueCount : 2;

  const learnerName = currentUser?.name?.split(' ')[0] || 'Ahmed';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isRTL ? `مرحباً بك مجدداً، ${learnerName}` : `Welcome back, ${learnerName}`}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {isRTL
            ? 'آخر مزامنة تمت قبل دقيقتين. تعمل كافة دروسك المحفوظة دون اتصال بالإنترنت.'
            : 'Last synced 2 minutes ago. Your saved lessons work offline.'}
        </p>
      </div>

      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Lessons completed */}
        <div className="bg-white dark:bg-[#151d30] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
            {isRTL ? 'الدروس المكتملة' : 'Lessons completed'}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {completedCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isRTL ? `من ${totalLessonsCount}` : `of ${totalLessonsCount}`}
            </span>
          </div>
        </div>

        {/* Card 2: Saved offline */}
        <div className="bg-white dark:bg-[#151d30] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
            {isRTL ? 'محفوظ أوفلاين' : 'Saved offline'}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {savedOfflineCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isRTL ? 'دروس' : 'lessons'}
            </span>
          </div>
        </div>

        {/* Card 3: Waiting to sync */}
        <div className="bg-white dark:bg-[#151d30] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
            {isRTL ? 'بانتظار المزامنة' : 'Waiting to sync'}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 dark:text-amber-400">
              {waitingSyncCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isRTL ? 'تحديثات' : 'updates'}
            </span>
          </div>
        </div>

        {/* Card 4: Submissions */}
        <div className="bg-white dark:bg-[#151d30] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
            {isRTL ? 'المشاريع المسلمة' : 'Submissions'}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              3
            </span>
            <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">
              {isRTL ? '١ يتطلب مراجعة' : '1 needs revision'}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Column: Progress by Track + My Submissions */}
        <div className="space-y-6">
          {/* Progress by Track Card */}
          <div className="bg-white dark:bg-[#151d30] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {isRTL ? 'التقدم حسب المسار البرمجي' : 'Progress by track'}
            </h3>

            <div className="space-y-4">
              {/* Python */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {language === 'ar' ? 'بايثون والذكاء الاصطناعي (SAIR)' : 'Python & AI Engineering'}
                  </span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">25%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full w-1/4"></div>
                </div>
              </div>

              {/* C++ */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600 dark:text-slate-400">
                    {language === 'ar' ? 'سي++ والأنظمة عالية الأداء' : 'C++ & High-Performance Systems'}
                  </span>
                  <span className="font-medium text-slate-400 dark:text-slate-500">0%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full w-0"></div>
                </div>
              </div>

              {/* Java */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600 dark:text-slate-400">
                    {language === 'ar' ? 'جافا وهندسة البرمجيات' : 'Java & Enterprise Architecture'}
                  </span>
                  <span className="font-medium text-slate-400 dark:text-slate-500">0%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full w-0"></div>
                </div>
              </div>
            </div>
          </div>

          {/* My Submissions Card */}
          <div className="bg-white dark:bg-[#151d30] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {isRTL ? 'مشاريعي المقدمة' : 'My submissions'}
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Row 1: Variables project */}
              <div className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {isRTL ? 'مشروع المتغيرات والمدخلات' : 'Variables project'}
                  </h4>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                    {isRTL ? 'المحاولة ٢' : 'Attempt 2'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                    {isRTL ? 'مطلوب مراجعة' : 'Revision requested'}
                  </span>
                  <Link
                    to="/project/topic-1"
                    className="px-3 py-1.5 bg-[#0f5132] hover:bg-[#0b3b24] dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                  >
                    {isRTL ? 'إعادة التسليم' : 'Resubmit'}
                  </Link>
                </div>
              </div>

              {/* Row 2: Strings project */}
              <div className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {isRTL ? 'مشروع النصوص والتنسيق' : 'Strings project'}
                  </h4>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                    {isRTL ? 'المحاولة ١' : 'Attempt 1'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                    {isRTL ? 'قيد المراجعة' : 'Under review'}
                  </span>
                  <Link
                    to="/project/topic-1"
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
                  >
                    {isRTL ? 'معاينة' : 'View'}
                  </Link>
                </div>
              </div>

              {/* Row 3: Input processing */}
              <div className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {isRTL ? 'مشروع معالجة المدخلات والدرجات' : 'Input processing'}
                  </h4>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                    {isRTL ? 'المحاولة ١' : 'Attempt 1'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                    {isRTL ? 'تم تقديم ملاحظات' : 'Feedback given'}
                  </span>
                  <Link
                    to="/project/topic-2"
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
                  >
                    {isRTL ? 'عرض الملاحظات' : 'View feedback'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sync Status + Latest Feedback */}
        <div className="space-y-6">
          {/* Sync Status Card */}
          <div className="bg-white dark:bg-[#151d30] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {isRTL ? 'حالة المزامنة' : 'Sync status'}
              </h3>
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="px-3.5 py-1.5 bg-[#0f5132] hover:bg-[#0b3b24] dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isRTL ? 'مزامنة الآن' : 'Sync now'}</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <div className="py-2.5 first:pt-0 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {isRTL ? 'تقدم الدرس ١' : 'Lesson 1 progress'}
                </span>
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  {isRTL ? 'متزامن' : 'Synced'}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {isRTL ? 'موقع الدرس ٢' : 'Lesson 2 position'}
                </span>
                <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  {isRTL ? 'قيد الانتظار' : 'Pending'}
                </span>
              </div>

              <div className="py-2.5 last:pb-0 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {isRTL ? 'تقدم اختبار الوحدة ١' : 'Quiz 1 progress'}
                </span>
                <button
                  type="button"
                  onClick={handleManualSync}
                  className="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
                >
                  {isRTL ? 'فشل · إعادة المحاولة' : 'Failed · Retry'}
                </button>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal pt-2 border-t border-slate-100 dark:border-slate-800">
              {isRTL
                ? 'تتم إعادة محاولة مزامنة العناصر المعلقة تلقائياً عند توفر الاتصال. لا يُحذف أي سجل حتى يؤكد السيرفر استلامه بأمان.'
                : 'Pending items retry automatically. Nothing is deleted until the server confirms it.'}
            </p>
          </div>

          {/* Latest Feedback Card */}
          <div className="bg-white dark:bg-[#151d30] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {isRTL ? 'أحدث الملاحظات والتقييمات' : 'Latest feedback'}
            </h3>

            <div>
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isRTL ? 'المرشدة سارة إبراهيم · مشروع المتغيرات' : 'Mentor Sarah · Variables project'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                {isRTL
                  ? 'هيكل البرنامج ممتاز ومحكم. يرجى إضافة تعليقات توضيحية لخطوات التحقق من مدخلات الأرقام ثم إعادة التسليم.'
                  : 'Good structure. Add comments that explain the input checks, then resubmit.'}
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/project/topic-1"
                className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg inline-block transition-colors"
              >
                {isRTL ? 'فتح تفاصيل المشروع' : 'Open submission'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sample Data Notice */}
      <div className="pt-2">
        <p className="text-[11px] text-slate-400">
          {isRTL ? 'بيانات تجريبية للمراجعة وتدقيق التصميم.' : 'Sample data for design review.'}
        </p>
      </div>
    </div>
  );
}
