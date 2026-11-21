import React from 'react';
import { Link } from 'react-router-dom';
import { useSync } from '../../context/SyncContext';
import { useLanguage } from '../../context/LanguageContext';
import { WifiOff, AlertTriangle, Lock, RefreshCw } from 'lucide-react';

export default function OfflineBanner() {
  const { isOnline, quotaWarning, storageUsagePercent, requiresReauth, syncError, manualRetrySync } = useSync();
  const { t, isRTL } = useLanguage();

  if (isOnline && !quotaWarning && !requiresReauth && !syncError) {
    return null;
  }

  return (
    <div className="space-y-1">
      {/* Session Expired While Offline (FR-12.1 / Alternative 3) */}
      {requiresReauth && (
        <div className="bg-purple-700 text-white text-xs sm:text-sm py-2 px-4 shadow-inner flex flex-wrap items-center justify-center gap-2">
          <Lock className="w-4 h-4 shrink-0" />
          <span>
            {isRTL
              ? 'انتهت صلاحية الجلسة أثناء عدم الاتصال. تم حفظ تقدمك في قائمة الانتظار بأمان. يرجى تسجيل الدخول مجدداً للمزامنة.'
              : 'Your session expired while offline. Your progress is safely preserved in queue. Please log in again to resume syncing.'}
          </span>
          <Link
            to="/login"
            className="underline font-bold hover:text-purple-200 ml-1"
          >
            {isRTL ? 'تسجيل الدخول الآن' : 'Log in now'}
          </Link>
        </div>
      )}

      {/* Sync Rejected (FR-5.7 / Alternative 4) */}
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

