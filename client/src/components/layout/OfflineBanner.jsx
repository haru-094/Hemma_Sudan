import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSync } from '../../context/SyncContext';
import { useLanguage } from '../../context/LanguageContext';
import { WifiOff, AlertTriangle, Lock, RefreshCw, Database } from 'lucide-react';

export default function OfflineBanner() {
  const { isOnline, quotaWarning, storageUsagePercent, requiresReauth, syncError, manualRetrySync, pendingQueue } = useSync();
  const { t, isRTL } = useLanguage();
  const location = useLocation();

  if (isOnline && !quotaWarning && !requiresReauth && !syncError) {
    return null;
  }

  const returnParam = location.pathname !== '/login' 
    ? `?returnTo=${encodeURIComponent(location.pathname + location.search)}&sessionExpired=true`
    : '';

  return (
    <div className="space-y-1">
      {/* Session Expired While Offline */}
      {requiresReauth && (
        <div className="bg-purple-800 text-white text-xs sm:text-sm py-2.5 px-4 shadow-md flex flex-wrap items-center justify-center gap-2 border-b border-purple-900">
          <div className="flex items-center gap-1.5 font-bold">
            <Lock className="w-4 h-4 shrink-0 text-amber-300" />
            <span>
              {isRTL
                ? 'انتهت صلاحية الجلسة أثناء عدم الاتصال.'
                : 'Session expired while offline.'}
            </span>
          </div>
          <span>
            {isRTL
              ? 'تم حفظ تقدمك في قائمة الانتظار بأمان. يرجى تسجيل الدخول مجدداً لاستئناف المزامنة التلقائية.'
              : 'Your progress is safely preserved in local queue. Please sign in to resume automatic sync.'}
          </span>
          {pendingQueue.length > 0 && (
            <span className="inline-flex items-center gap-1 bg-purple-900/80 px-2 py-0.5 rounded text-[11px] font-mono font-semibold text-purple-200">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>{pendingQueue.length} {isRTL ? 'عناصر محفوظة' : 'queued items'}</span>
            </span>
          )}
          {location.pathname !== '/login' && (
            <Link
              to={`/login${returnParam}`}
              className="ml-2 px-2.5 py-0.5 bg-white text-purple-900 rounded font-bold hover:bg-purple-100 transition-colors shadow-sm cursor-pointer"
            >
              {isRTL ? 'تسجيل الدخول الآن' : 'Log in now'}
            </Link>
          )}
        </div>
      )}

      {/* Sync Rejected */}
      {syncError && syncError.status !== 401 && (
        <div className="bg-rose-700 text-white text-xs sm:text-sm py-2 px-4 shadow-inner flex flex-wrap items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            {isRTL
              ? `تعذرت المزامنة (${syncError.errorCode || syncError.status}): ${syncError.message}`
              : `Sync rejected (${syncError.errorCode || syncError.status}): ${syncError.message}`}
          </span>
          <button
            onClick={manualRetrySync}
            className="underline font-bold hover:text-rose-200 ml-2 inline-flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isRTL ? 'إعادة المحاولة يدوياً' : 'Retry'}</span>
          </button>
        </div>
      )}

      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs sm:text-sm py-2 px-4 shadow-inner flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>{t.sync.offlineNotice}</span>
        </div>
      )}

      {quotaWarning && (
        <div className="bg-rose-600 text-white text-xs sm:text-sm py-2 px-4 shadow-inner flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{t.sync.quotaWarning} ({storageUsagePercent}% {isRTL ? 'مستخدم' : 'used'})</span>
        </div>
      )}
    </div>
  );
}

