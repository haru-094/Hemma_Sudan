import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Shield, Heart } from 'lucide-react';

export default function Footer() {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="bg-white dark:bg-[#151d30] border-t border-slate-200 dark:border-slate-800 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <img src="/hemma-favicon-v2-64.png" alt="Hemma Logo" className="w-4 h-4 object-contain rounded" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">{t.appName}</span>
            <span>—</span>
            <span>{t.appTagline}</span>
          </div>

          <div className="flex items-center gap-1">
            <span>{isRTL ? 'بُنيت بمعمارية مرنة تدعم العمل دون اتصال لطلاب السودان.' : 'Built with resilient offline-first architecture for Sudan.'}</span>
          </div>

          <div className="text-slate-400 dark:text-slate-500">
            <span>© 2026 African Leadership University (ALU)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

