import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { TOPICS, LESSONS } from '../data/mockData';
import { 
  BookOpen, 
  WifiOff, 
  RefreshCw, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Code
} from 'lucide-react';

export default function LandingPage() {
  const { t, isRTL, language } = useLanguage();
  const { currentUser } = useAuth();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-teal-900 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 rounded-3xl shadow-xl mx-2 sm:mx-6 mt-4">
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold uppercase tracking-wider">
            <span>{isRTL ? 'التعليم المقاوم لانقطاع الإنترنت' : 'Offline-Resilient Learning Platform'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            {isRTL ? (
              <>
                واصل تعلم البرمجة <br className="hidden sm:inline" />
                <span className="text-emerald-400">حتى أثناء انقطاع الإنترنت</span>
              </>
            ) : (
              <>
                Keep Learning Programming <br className="hidden sm:inline" />
                <span className="text-emerald-400">Even During Internet Blackouts</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.missionNotice}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/lessons"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>{isRTL ? 'تصفح الدروس والمقررات' : 'Explore Course Lessons'}</span>
              <ArrowIcon className="w-5 h-5" />
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-base backdrop-blur-md border border-white/20 transition-colors"
            >
              <span>{isRTL ? 'لوحة المتابعة الشخصية' : 'View My Dashboard'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <WifiOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {isRTL ? 'حفظ الدروس دون اتصال' : 'Save Lessons Offline'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isRTL
                ? 'قم بتحميل الملاحظات التوضيحية والأمثلة البرمجية بنقرة واحدة لتدرسها وتجربها بدون الحاجة إلى إنترنت.'
                : 'Download lightweight lesson packages and code examples directly to your browser storage to study anytime.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {isRTL ? 'مزامنة ذكية للتقدم' : 'Smart Progress Sync'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isRTL
                ? 'يسجل النظام إنجازك محلياً وعندما يعود الاتصال بالإنترنت تتم مزامنة تقدمك تلقائياً دون تكرار.'
                : 'Progress is tracked locally with duplicate protection. When internet reconnects, updates sync smoothly.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {isRTL ? 'إرشاد وتقييم أكاديمي' : 'Teacher & Mentor Feedback'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isRTL
                ? 'قدم مشاريعك عبر روابط GitHub عندما تكون متصلاً، وتلقى ملاحظات دقيقة من مرشدين معتمدين أو الأستاذ.'
                : 'Submit code repositories via GitHub when online. Receive detailed feedback, revision requests, or escalations.'}
            </p>
          </div>
        </div>
      </section>

      {/* Course Overview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isRTL ? 'منهاج المقرر: مقدمة في بايثون' : 'Course Curriculum: Introduction to Python'}
            </h2>
            <p className="text-sm text-slate-600">
              {isRTL
                ? 'المقرر التكميلي لطلاب الجامعات في السودان'
                : 'Supplementary pilot curriculum for university students in Sudan'}
            </p>
          </div>
          <Link
            to="/lessons"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <span>{isRTL ? 'عرض جميع الوحدات' : 'View All Modules'}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOPICS.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-emerald-300 transition-colors"
            >
              <div className="space-y-3">
                <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                  {isRTL ? `الوحدة ${topic.displayOrder}` : `Topic ${topic.displayOrder}`}
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  {language === 'ar' ? topic.titleAr : topic.titleEn}
                </h4>
                <p className="text-xs text-slate-600">
                  {language === 'ar' ? topic.descriptionAr : topic.descriptionEn}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  {LESSONS.filter((l) => l.topicId === topic.id).length}{' '}
                  {isRTL ? 'دروس متوفرة' : 'lessons available'}
                </span>
                <Link
                  to="/lessons"
                  className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>{isRTL ? 'ابدأ' : 'Start'}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

