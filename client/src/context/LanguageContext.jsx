import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    appName: 'Hemma Sudan',
    appTagline: 'Programming Learning & Mentorship Platform',
    missionNotice: 'Designed for learners in Sudan with offline-first study and intermittent sync.',
    nav: {
      home: 'Home',
      lessons: 'Lessons',
      dashboard: 'Dashboard',
      reviews: 'Reviews',
      teacherAdmin: 'Teacher Hub',
      login: 'Log In',
      register: 'Register',
      logout: 'Log Out',
    },
    roles: {
      learner: 'Learner',
      mentor: 'Mentor',
      teacher: 'Teacher',
    },
    sync: {
      online: 'Online',
      offline: 'Offline Mode',
      synced: 'All progress synced',
      pending: 'Progress updates pending sync',
      failed: 'Sync failed - retry',
      syncNow: 'Sync Now',
      offlineNotice: 'You are currently offline. You can continue studying saved lessons. Submissions and reviews require an active connection.',
      quotaWarning: 'Storage alert: Local cache exceeds 80% quota limit. Free up space before saving new lessons.',
    },
    submissionStatus: {
      submitted: 'Submitted',
      underReview: 'Under Review',
      revisionRequested: 'Revision Requested',
      escalated: 'Escalated with Teacher',
      feedbackGiven: 'Feedback Provided',
      complete: 'Complete & Accepted',
    },
    common: {
      saveOffline: 'Save for Offline',
      savedOffline: 'Saved Offline',
      removeOffline: 'Remove from Storage',
      loading: 'Loading...',
      actions: 'Actions',
      status: 'Status',
      date: 'Date',
      topic: 'Topic',
      submit: 'Submit',
      cancel: 'Cancel',
      retry: 'Retry',
      save: 'Save',
      back: 'Back',
      next: 'Next',
      viewDetails: 'View Details',
      languageSwitch: 'العربية',
    },
  },
  ar: {
    appName: 'همة السودان',
    appTagline: 'منصة تعلم البرمجة والإرشاد الأكاديمي',
    missionNotice: 'مصممة للطلاب في السودان للتعلم دون اتصال ومزامنة التقدم عند عودة الإنترنت.',
    nav: {
      home: 'الرئيسية',
      lessons: 'الدروس',
      dashboard: 'لوحة التحكم',
      reviews: 'المراجعات',
      teacherAdmin: 'إدارة المعلم',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      logout: 'تسجيل الخروج',
    },
    roles: {
      learner: 'طالب',
      mentor: 'مرشد',
      teacher: 'أستاذ المادة',
    },
    sync: {
      online: 'متصل بالإنترنت',
      offline: 'وضع عدم الاتصال',
      synced: 'تمت مزامنة جميع البيانات',
      pending: 'تحديثات في انتظار المزامنة',
      failed: 'فشلت المزامنة - إعادة المحاولة',
      syncNow: 'مزامنة الآن',
      offlineNotice: 'أنت غير متصل بالإنترنت حالياً. يمكنك متابعة دراسة الدروس المحفوظة. تقديم الواجبات والمراجعات يتطلب اتصالاً نشطاً.',
      quotaWarning: 'تنبيه السعة: تجاوزت المساحة المحلية 80% من الحد المسموح. يرجى تحرير بعض المساحة قبل حفظ دروس جديدة.',
    },
    submissionStatus: {
      submitted: 'تم التقديم',
      underReview: 'قيد المراجعة',
      revisionRequested: 'مطلوب مراجعة وتعديل',
      escalated: 'مُصعّد إلى الأستاذ',
      feedbackGiven: 'تم تقديم الملاحظات',
      complete: 'مكتمل ومقبول',
    },
    common: {
      saveOffline: 'حفظ للاستخدام بدون إنترنت',
      savedOffline: 'محفوظ في الجهاز',
      removeOffline: 'حذف من الجهاز',
      loading: 'جاري التحميل...',
      actions: 'إجراءات',
      status: 'الحالة',
      date: 'التاريخ',
      topic: 'الموضوع',
      submit: 'إرسال',
      cancel: 'إلغاء',
      retry: 'إعادة المحاولة',
      save: 'حفظ',
      back: 'رجوع',
      next: 'التالي',
      viewDetails: 'عرض التفاصيل',
      languageSwitch: 'English',
    },
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // English is default per SRS §1.4 / FR-3.1
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('hemma_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('hemma_lang', language);
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = translations[language] || translations.en;
  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

