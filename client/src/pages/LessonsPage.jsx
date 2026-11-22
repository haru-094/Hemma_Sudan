import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSync } from '../context/SyncContext';
import { TOPICS, LESSONS, TRACKS } from '../data/mockData';
import { 
  DownloadCloud, 
  Check, 
  Trash2, 
  Video, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  HardDrive,
  HelpCircle,
  FolderGit2,
  RefreshCw,
  Sparkles,
  Code2,
  Compass,
  CheckCircle2
} from 'lucide-react';

export default function LessonsPage() {
  const { t, isRTL, language } = useLanguage();
  const { isLessonSaved, toggleSaveOffline, storageUsagePercent, quotaWarning, lessonContentStatus, refreshSavedLesson } = useSync();
  const [selectedTrack, setSelectedTrack] = useState('python');
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const currentTrack = TRACKS.find((tr) => tr.id === selectedTrack) || TRACKS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with storage usage info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isRTL ? 'المسارات التخصصية والوحدات التعليمية' : 'Focus Tracks & Curriculum Modules'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {isRTL
              ? 'اختر مسارك البرمجي المركز (بايثون للذكاء الاصطناعي، C++ للأنظمة، أو جافا للمؤسسات). يبدأ كل درس بالأمثلة الأساسية ثم يتدرج للمفاهيم المتقدمة.'
              : 'Select your focus programming track (Python AI, C++ Systems, or Java Enterprise). Each lesson starts with basic foundations then progresses to advanced concepts.'}
          </p>
        </div>

        {/* Local Storage Quota Widget */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 shrink-0">
          <HardDrive className="w-5 h-5 text-slate-500" />
          <div className="text-xs">
            <div className="flex justify-between items-center gap-4">
              <span className="font-semibold text-slate-700">
                {isRTL ? 'سعة التخزين المحلي (IndexedDB)' : 'Offline Cache Quota'}
              </span>
              <span className={`font-bold ${quotaWarning ? 'text-rose-600' : 'text-slate-600'}`}>
                {storageUsagePercent}%
              </span>
            </div>
            <div className="w-36 sm:w-44 bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  quotaWarning ? 'bg-rose-500' : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.min(storageUsagePercent, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Track Selection Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-600" />
            <span>{isRTL ? 'اختر مسار التعلم المفضل لديك:' : 'Choose Your Active Focus Track:'}</span>
          </h2>
          <span className="text-xs text-slate-500">
            {isRTL ? 'يمكنك التبديل بين المسارات في أي وقت' : 'Switch tracks anytime inside lessons'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRACKS.map((track) => {
            const isSelected = selectedTrack === track.id;
            return (
              <div
                key={track.id}
                onClick={() => setSelectedTrack(track.id)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {track.isSairTrack && (
                  <div className="absolute top-0 right-0 rtl:left-0 rtl:right-auto bg-purple-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg rtl:rounded-bl-none rtl:rounded-br-lg flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3" />
                    <span>SAIR AI Community</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-xs">
                    {track.icon}
                  </div>
                  {isSelected ? (
                    <span className="text-emerald-700 font-bold text-xs flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isRTL ? 'المسار النشط' : 'Active'}</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">
                      {language === 'ar' ? track.badgeAr : track.badgeEn}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {language === 'ar' ? track.titleAr : track.titleEn}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'ar' ? track.descriptionAr : track.descriptionEn}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono text-emerald-800 font-semibold">{track.syntax}</span>
                  <span className="font-semibold text-slate-700">★ Basic & ★★ Advanced</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modules List for Selected Track */}
      <div className="space-y-10 pt-2">
        {TOPICS.map((topic) => {
          const topicLessons = LESSONS.filter((l) => l.topicId === topic.id);

          return (
            <div
              key={topic.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-0"
            >
              {/* Topic Header */}
              <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
                      {isRTL ? `المحور ${topic.displayOrder}` : `Module ${topic.displayOrder}`}
                    </span>
                    {topic.sairTrack && (
                      <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded inline-flex items-center gap-1 border border-purple-200">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>{isRTL ? 'مسار مجتمع SAIR للذكاء الاصطناعي' : 'SAIR AI Track'}</span>
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded flex items-center gap-1">
                      <span>{currentTrack.icon}</span>
                      <span>{language === 'ar' ? currentTrack.shortTitleAr : currentTrack.shortTitleEn}</span>
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded">
                      ★ {isRTL ? 'أساسي' : 'Basic'} & ★★ {isRTL ? 'متقدم' : 'Advanced'}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {language === 'ar' ? topic.titleAr : topic.titleEn}
                  </h2>
                  <p className="text-xs text-slate-600">
                    {language === 'ar' ? topic.descriptionAr : topic.descriptionEn}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-500 font-medium">
                    {topicLessons.length} {isRTL ? 'دروس' : 'lessons'} + {isRTL ? 'اختبار' : 'quiz'} + {isRTL ? 'مشروع' : 'project'}
                  </span>
                </div>
              </div>

              {/* Module Lessons */}
              <div className="divide-y divide-slate-100">
                {topicLessons.map((lesson, idx) => {
                  const saved = isLessonSaved(lesson.id);
                  const trackData = lesson.languages?.[selectedTrack];
                  const hasAdvanced = !!trackData?.advanced;

                  return (
                    <div
                      key={lesson.id}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h3 className="text-base font-bold text-slate-900">
                            {language === 'ar' ? lesson.titleAr : lesson.titleEn}
                          </h3>
                          {saved && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" />
                              {t.common.savedOffline}
                            </span>
                          )}

                          {/* Content Conflict Flags (FR-5.6) */}
                          {saved && lessonContentStatus?.[lesson.id] === 'update_available' && (
                            <button
                              type="button"
                              onClick={() => refreshSavedLesson(lesson.id)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full hover:bg-amber-200 transition-colors shadow-xs cursor-pointer"
                              title={isRTL ? 'تحديث متوفر للدرس - اضغط للتحديث' : 'Update available on server - tap to refresh'}
                            >
                              <RefreshCw className="w-3 h-3 text-amber-700" />
                              <span>{isRTL ? 'تحديث متوفر' : 'Update Available'}</span>
                            </button>
                          )}

                          {saved && lessonContentStatus?.[lesson.id] === 'no_longer_available' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                              <span>{isRTL ? 'غير متاح على الخادم' : 'No longer available'}</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-1 pl-7 rtl:pr-7 rtl:pl-0">
                          {language === 'ar' ? lesson.notesAr : lesson.notesEn}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1 pl-7 rtl:pr-7 rtl:pl-0">
                          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                            <FileText className="w-3.5 h-3.5 text-emerald-600" />
                            {isRTL ? '★ مثال أساسي' : '★ Basic Example'}
                          </span>
                          {hasAdvanced && (
                            <span className="flex items-center gap-1 text-purple-700 font-semibold">
                              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                              {isRTL ? '★★ تطبيق متقدم' : '★★ Advanced Application'}
                            </span>
                          )}
                          {lesson.recordingLink && (
                            <span className="flex items-center gap-1 text-blue-600">
                              <Video className="w-3.5 h-3.5" />
                              {isRTL ? 'تسجيل الجلسة' : 'Class Recording'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:self-center shrink-0">
                        {/* Offline Save Toggle */}
                        <button
                          onClick={() => toggleSaveOffline(lesson.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            saved
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                          title={saved ? t.common.removeOffline : t.common.saveOffline}
                        >
                          {saved ? (
                            <>
                              <Trash2 className="w-4 h-4 text-rose-500" />
                              <span className="hidden sm:inline">{t.common.removeOffline}</span>
                            </>
                          ) : (
                            <>
                              <DownloadCloud className="w-4 h-4 text-slate-600" />
                              <span>{t.common.saveOffline}</span>
                            </>
                          )}
                        </button>

                        {/* Open Lesson in Active Track */}
                        <Link
                          to={`/lessons/${lesson.id}?track=${selectedTrack}`}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-sm transition-colors"
                        >
                          <span>{isRTL ? 'فتح الدرس' : 'Study Lesson'}</span>
                          <ArrowIcon className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}

                {/* Module Checkpoint Bar: Quiz + Capstone Project */}
                <div className="bg-amber-50/40 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-amber-100">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                        {isRTL ? 'محطة المراجعة والمشروع النهائي' : 'Module Checkpoint & Capstone Project'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {language === 'ar' ? topic.assignment.titleAr : topic.assignment.titleEn}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      to={`/lessons/${topicLessons[topicLessons.length - 1]?.id}?track=${selectedTrack}#module-quiz`}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 flex items-center gap-1 shadow-sm"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isRTL ? 'اختبار المفاهيم' : 'Self Quiz'}</span>
                    </Link>

                    <Link
                      to={`/project/${topic.id}`}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <FolderGit2 className="w-4 h-4 text-emerald-400" />
                      <span>{isRTL ? 'مشروع الوحدة (GitHub)' : 'Module Project'}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
