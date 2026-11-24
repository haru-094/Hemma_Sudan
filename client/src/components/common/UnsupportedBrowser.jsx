import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AlertTriangle, X } from 'lucide-react';

function checkBrowserSupport() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  try {
    const ua = navigator.userAgent;

    // Check Chrome / Edge version
    const chromeMatch = ua.match(/(Chrome|CriOS|Edg)\/(\d+)/);
    if (chromeMatch && parseInt(chromeMatch[2], 10) < 115) {
      return true;
    }

    // Check Safari version
    const safariMatch = ua.match(/Version\/(\d+).*Safari/);
    if (safariMatch && parseInt(safariMatch[1], 10) < 16) {
      return true;
    }

    // Check core offline features
    if (!('indexedDB' in window) || !('serviceWorker' in navigator)) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export default function UnsupportedBrowser() {
  const { isRTL } = useLanguage();
  const [isUnsupported] = useState(checkBrowserSupport);
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isUnsupported || isDismissed) return null;

  return (
    <div className="bg-amber-600 text-white px-4 py-2.5 text-xs flex items-center justify-between gap-3 shadow-md z-50">
      <div className="flex items-center gap-2 max-w-5xl mx-auto">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-200" />
        <span>
          {isRTL
            ? 'تنبيه التوافق (معيار 2.4): يبدو أنك تستخدم إصدار متصفح قديماً. لتحقيق أقصى استفادة من ميزات الحفظ بدون إنترنت، نوصي بتحديث Chrome أو Edge أو Safari.'
            : 'Browser Compatibility Notice (Section 2.4): You appear to be using an older browser. For full offline PWA storage, Chrome/Edge 115+ or Safari 16+ is recommended.'}
        </span>
      </div>
      <button
        onClick={() => setIsDismissed(true)}
        className="text-amber-100 hover:text-white p-1 rounded-md cursor-pointer"
        aria-label="Dismiss notice"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
