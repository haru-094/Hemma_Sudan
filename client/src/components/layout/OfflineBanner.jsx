import React from 'react';
import { useSync } from '../../context/SyncContext';
import { useLanguage } from '../../context/LanguageContext';
import { WifiOff, AlertTriangle } from 'lucide-react';

export default function OfflineBanner() {
  const { isOnline, quotaWarning, storageUsagePercent } = useSync();
  const { t } = useLanguage();

  if (isOnline && !quotaWarning) {
    return null;
  }

  return (
    <div className="space-y-1">
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs sm:text-sm py-2 px-4 shadow-inner flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>{t.sync.offlineNotice}</span>
        </div>
      )}

      {quotaWarning && (
        <div className="bg-rose-600 text-white text-xs sm:text-sm py-2 px-4 shadow-inner flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{t.sync.quotaWarning} ({storageUsagePercent}% used)</span>
        </div>
      )}
    </div>
  );
}

