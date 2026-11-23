import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSync } from '../context/SyncContext';
import { TOPICS, LESSONS, TRACKS } from '../data/mockData';
import { 
  DownloadCloud, 
  Check, 
  RefreshCw,
  Video,
  ExternalLink,
  Code2,
  WifiOff,
  FolderDown
} from 'lucide-react';

export default function LessonsPage() {
  const { isRTL, language } = useLanguage();
  const { 
    isOnline,
    isLessonSaved, 
    toggleSaveOffline, 
    storageUsagePercent, 
    lessonContentStatus, 
    refreshSavedLesson 
  } = useSync();
  const navigate = useNavigate();

  const saveWholeModule = async (topicLessons) => {
    for (const l of topicLessons) {
      if (!isLessonSaved(l.id)) {
        await toggleSaveOffline(l.id);
      }
    }
  };

  // Selected track state (default 'python')
  const [activeTrackId, setActiveTrackId] = useState('python');

  const activeTrack = TRACKS.find((t) => t.id === activeTrackId) || TRACKS[0];

  // Calculate saved offline lessons count
  const savedCount = LESSONS.filter((l) => isLessonSaved(l.id)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header with Offline Storage Widget */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {isRTL ? 'مساراتك التعليمية' : 'Your learning tracks'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            {isRTL
              ? 'اختر مساراً برمجياً، احفظ الدروس أثناء اتصالك بالإنترنت، وتابع التعلم دون انقطاع حتى عند ضعف الشبكة.'
              : 'Pick a track, save lessons while you are online, and keep studying when the connection drops.'}
          </p>
        </div>

        {/* Offline Storage Widget Card */}
        <div className="bg-white dark:bg-[#151d30] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs w-full sm:w-72 space-y-1.5 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {isRTL ? 'التخزين المحلي' : 'Offline storage'}
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {storageUsagePercent}% {isRTL ? 'مستخدم' : 'used'}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#0f5132] dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(storageUsagePercent, 100)}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
            {isRTL
              ? 'يظهر تنبيه عند بلوغ 80%. يتوقف الحفظ المؤقت عند امتلاء السعة.'
              : 'You get a warning at 80%. Saving pauses when space runs out.'}
          </p>
        </div>
      </div>

      {/* 3 Learning Track Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Track 1: Python & AI Engineering */}
        <div
          className={`bg-white dark:bg-[#151d30] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
            activeTrackId === 'python'
              ? 'border-2 border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-600/10'
              : 'border border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                Py
              </div>
              {activeTrackId === 'python' ? (
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  {isRTL ? 'المسار النشط' : 'Active track'}
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">AI & ML</span>
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {language === 'ar' ? 'بايثون والذكاء الاصطناعي (SAIR)' : 'Python & AI Engineering'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                {isRTL
                  ? 'من الأساسيات إلى NumPy و Pandas ونماذج تعلم الآلة المعتمدة مع مجتمع SAIR.'
                  : 'From fundamentals to NumPy, Pandas and machine learning models.'}
              </p>
            </div>
          </div>

          {activeTrackId === 'python' ? (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{isRTL ? '٢٥٪ مكتمل' : '25% complete'}</span>
              <span>{savedCount} {isRTL ? 'محفوظ أوفلاين' : 'saved offline'}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTrackId('python')}
              className="w-full py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {isRTL ? 'التحويل لهذا المسار' : 'Switch to this track'}
            </button>
          )}
        </div>

        {/* Track 2: C++ & High-Performance Systems */}
        <div
          className={`bg-white dark:bg-[#151d30] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
            activeTrackId === 'cpp'
              ? 'border-2 border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-600/10'
              : 'border border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs border dark:border-slate-700">
                C++
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                {activeTrackId === 'cpp' ? (
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    {isRTL ? 'المسار النشط' : 'Active track'}
                  </span>
                ) : (
                  isRTL ? 'أنظمة' : 'Systems'
                )}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {language === 'ar' ? 'سي++ والأنظمة عالية الأداء' : 'C++ & High-Performance Systems'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                {isRTL
                  ? 'إدارة الذاكرة، المؤشرات الآمنة، والحوسبة المحسنة للذاكرة المخبئية.'
                  : 'Memory management, pointer safety and cache-aware algorithms.'}
              </p>
            </div>
          </div>

          {activeTrackId === 'cpp' ? (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{isRTL ? '٠٪ مكتمل' : '0% complete'}</span>
              <span>{savedCount} {isRTL ? 'محفوظ أوفلاين' : 'saved offline'}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTrackId('cpp')}
              className="w-full py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {isRTL ? 'التحويل لهذا المسار' : 'Switch to this track'}
            </button>
          )}
        </div>

        {/* Track 3: Java & Enterprise Architecture */}
        <div
          className={`bg-white dark:bg-[#151d30] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
            activeTrackId === 'java'
              ? 'border-2 border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-600/10'
              : 'border border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-800 dark:bg-amber-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                Jv
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                {activeTrackId === 'java' ? (
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    {isRTL ? 'المسار النشط' : 'Active track'}
                  </span>
                ) : (
                  isRTL ? 'أنظمة خلفية' : 'Backend'
                )}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {language === 'ar' ? 'جافا وهندسة البرمجيات' : 'Java & Enterprise Architecture'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                {isRTL
                  ? 'التصميم كائني التوجه، سجلات جافا، التدفقات المتوازية، والأنظمة القابلة للتوسع.'
                  : 'Object-oriented design, records, streams and scalable backends.'}
              </p>
            </div>
          </div>

          {activeTrackId === 'java' ? (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{isRTL ? '٠٪ مكتمل' : '0% complete'}</span>
              <span>{savedCount} {isRTL ? 'محفوظ أوفلاين' : 'saved offline'}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTrackId('java')}
              className="w-full py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {isRTL ? 'التحويل لهذا المسار' : 'Switch to this track'}
            </button>
          )}
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-8">
        {TOPICS.filter((topic) => {
          // AI / SAIR track ONLY shows in Python track
          if (topic.sairTrack || topic.trackOnly === 'python' || topic.id === 'topic-4') {
            return activeTrackId === 'python';
          }
          return !topic.languages || topic.languages.includes(activeTrackId);
        }).map((topic, topicIdx) => {
          const topicLessons = LESSONS.filter((l) => l.topicId === topic.id);
          const completedCount = topicLessons.filter((l) => isLessonSaved(l.id)).length;

          return (
            <div
              key={topic.id}
              className="bg-white dark:bg-[#151d30] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 space-y-6 shadow-xs"
            >
              {/* Module Header */}
              <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase">
                    {isRTL ? `المحور ${topicIdx + 1}` : `MODULE ${topicIdx + 1}`}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {completedCount < topicLessons.length && (
                      <button
                        type="button"
                        onClick={() => saveWholeModule(topicLessons)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                        title={isRTL ? 'حفظ كافة دروس هذه الوحدة دفعة واحدة للدراسة بدون إنترنت' : 'Save all lessons in this module for offline study'}
                      >
                        <FolderDown className="w-3.5 h-3.5" />
                        <span>{isRTL ? 'حفظ كامل الوحدة' : 'Save whole module'}</span>
                      </button>
                    )}
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      {completedCount} {isRTL ? `من ${topicLessons.length} دروس مكتملة` : `of ${topicLessons.length} lessons done`}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {language === 'ar' ? topic.titleAr : topic.titleEn}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {language === 'ar' ? topic.descriptionAr : topic.descriptionEn}
                </p>
              </div>

              {/* Dedicated Module Live or Recorded Session Banner */}
              {topic.session && (
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-colors ${
                  topic.session.type === 'live'
                    ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                    : 'bg-slate-50/80 dark:bg-[#10192d] border-slate-200/90 dark:border-slate-800'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                      topic.session.type === 'live'
                        ? 'bg-rose-600 text-white'
                        : 'bg-indigo-600 text-white'
                    }`}>
                      <Video className="w-5 h-5" />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        {topic.session.type === 'live' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                            <span>{isRTL ? 'بث مباشر الآن' : 'LIVE CLASS NOW'}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40">
                            {topic.session.platform} • {topic.session.duration}
                          </span>
                        )}

                        <span className="text-[11px] text-slate-500 font-medium">
                          {topic.session.instructor || 'Dr. Al-Amin'}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {language === 'ar' ? topic.session.titleAr : topic.session.titleEn}
                      </h4>
                    </div>
                  </div>

                  <a
                    href={topic.session.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0 shadow-2xs transition-all cursor-pointer ${
                      topic.session.type === 'live'
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 dark:shadow-none'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>
                      {topic.session.type === 'live'
                        ? (isRTL ? 'انضم للبث المباشر' : 'Join Live Class')
                        : (isRTL ? 'مشاهدة التسجيل' : 'Watch Recording')}
                    </span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Module Lessons List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {topicLessons.map((lesson, idx) => {
                  const saved = isLessonSaved(lesson.id);
                  const statusConflict = lessonContentStatus?.[lesson.id];

                  return (
                    <div
                      key={lesson.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {idx + 1}. {language === 'ar' ? lesson.titleAr : lesson.titleEn}
                          </h4>

                          {/* Status Badges & Low-Bandwidth Payload Size */}
                          {saved ? (
                            <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <span>{isRTL ? 'محفوظ أوفلاين' : 'Saved offline'}</span>
                            </span>
                          ) : (
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium px-2 py-0.5 rounded-full">
                              {isRTL ? 'غير محفوظ' : 'Not saved'}
                            </span>
                          )}

                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono px-1">
                            ~12 KB
                          </span>

                          {saved && (
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium px-2 py-0.5 rounded-full">
                              {isRTL ? 'متزامن' : 'Synced'}
                            </span>
                          )}

                          {statusConflict === 'update_available' && (
                            <button
                              type="button"
                              onClick={() => refreshSavedLesson(lesson.id)}
                              className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400"></span>
                              <span>{isRTL ? 'تحديث متوفر' : 'Update available'}</span>
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {language === 'ar' ? lesson.notesAr?.slice(0, 120) : lesson.notesEn?.slice(0, 120)}...
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                          <Link
                            to={`/lessons/${lesson.id}?track=${activeTrackId}`}
                            className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                          >
                            {isRTL ? 'المثال الأساسي' : 'Basic example'}
                          </Link>
                          <span>·</span>
                          <Link
                            to={`/lessons/${lesson.id}?track=${activeTrackId}`}
                            className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                          >
                            {isRTL ? 'التطبيق المتقدم' : 'Advanced application'}
                          </Link>
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                        {saved ? (
                          <button
                            type="button"
                            onClick={() => toggleSaveOffline(lesson.id)}
                            className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                          >
                            {isRTL ? 'حذف من الجهاز' : 'Remove from device'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleSaveOffline(lesson.id)}
                            className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                          >
                            {isRTL ? 'حفظ بدون إنترنت' : 'Save for offline'}
                          </button>
                        )}

                        <Link
                          to={`/lessons/${lesson.id}?track=${activeTrackId}`}
                          className="px-4 py-1.5 bg-[#0f5132] hover:bg-[#0b3b24] dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                        >
                          {isRTL ? 'فتح الدرس' : 'Study lesson'}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Module Checkpoint & Project Box (FR-6.4 Offline Guard) */}
              <div className="bg-[#faf8f4] dark:bg-[#10192d] border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {isRTL ? 'محطة المراجعة ومشروع الوحدة' : 'Module checkpoint & project'}
                    </h4>
                    {isOnline ? (
                      <span className="bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {isRTL ? 'يتطلب إنترنت' : 'Online only'}
                      </span>
                    ) : (
                      <span className="bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 text-[10px] font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                        <WifiOff className="w-3 h-3" />
                        <span>{isRTL ? 'يتطلب اتصال إنترنت (معيار FR-6.4)' : 'Needs internet (FR-6.4)'}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isRTL
                      ? 'ارفع رابط مستودع GitHub مع شرح الكود. تتطلب المشاريع اتصالاً مباشراً بالإنترنت ولا تُحفظ في قائمة الانتظار وفقاً لمعيار FR-6.4.'
                      : 'Submit your GitHub link with an explanation. Submissions need an active internet connection and are never queued (FR-6.4).'}
                  </p>
                </div>

                {isOnline ? (
                  <Link
                    to={`/project/${topic.id}`}
                    className="px-4 py-2 bg-[#0f5132] hover:bg-[#0b3b24] dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-2xs shrink-0 inline-flex items-center justify-center transition-colors"
                  >
                    {isRTL ? 'تسليم المشروع' : 'Submit project'}
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-semibold rounded-lg shadow-none shrink-0 inline-flex items-center justify-center cursor-not-allowed opacity-80"
                    title={isRTL ? 'يتطلب اتصالاً بالإنترنت لتسليم المشروع (معيار FR-6.4)' : 'Internet connection required to submit project (FR-6.4)'}
                  >
                    <span>{isRTL ? 'تسليم المشروع (غير متصل)' : 'Submit project (Offline)'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
