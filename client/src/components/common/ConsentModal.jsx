import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, AlertCircle, Check, X, Database, Clock } from 'lucide-react';

export default function ConsentModal() {
  const { showConsentModal, setShowConsentModal, updateConsent, consentStatus, loginCount } = useAuth();
  const { t, isRTL } = useLanguage();

  if (!showConsentModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header Icon & Title */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <button
            onClick={() => setShowConsentModal(false)}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">
              {isRTL
                ? 'إشعار الاحتفاظ بالبيانات والخصوصية (NFR-14)'
                : 'Data Retention & Privacy Notice (NFR-14)'}
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
              Session #{loginCount}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isRTL
              ? 'مرحباً بعودتك! تعمل همة السودان حالياً في طور العرض والتقييم. بشكل افتراضي، يتم الاحتفاظ بمشاريع الطلاب وسجلات التقدم طوال فترة التجربة فقط، وتُحذف أو تُجهّل هويتها تلقائياً عند انتهاء العرض.'
              : 'Welcome back! Hemma Sudan is currently operating in evaluation mode. By default, learner submission and progress data is retained only for the demo duration and automatically deleted or anonymized afterwards.'}
          </p>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
            {isRTL
              ? 'هل توافق على الاحتفاظ بسجلاتك وحسابك للمتابعة لاحقاً بعد انتهاء فترة التجربة؟'
              : 'Do you consent to retaining your learning records and account beyond the demo period so you can continue learning without interruption?'}
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isRTL
                ? 'الموافقة تتيح لك استرجاع مشروعاتك، مراجعات المرشدين، ونقاط التقدم السابقة.'
                : 'Granting consent preserves your projects, mentor reviews, and exercise progress.'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {isRTL
                ? 'في حال عدم الموافقة، سيتم مسح بياناتك فوراً عند قيام أستاذ المقرر بتنظيف بيانات التجربة.'
                : 'Declining ensures all your submission data is purged when the instructor clears demo records.'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={() => updateConsent(true)}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isRTL ? 'أوافق على الاحتفاظ ببياناتي' : 'I Consent (Retain Data)'}</span>
          </button>
          <button
            onClick={() => updateConsent(false)}
            className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>{isRTL ? 'رفض (حذف بعد التجربة)' : 'Decline (Purge After Demo)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
