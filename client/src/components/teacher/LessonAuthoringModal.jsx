import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { TOPICS } from '../../data/mockData';
import { 
  Sparkles, 
  Languages, 
  AlertCircle, 
  FileText, 
  Code, 
  Video,
  Send,
  Loader2
} from 'lucide-react';

export default function LessonAuthoringModal({ isOpen, onClose, topics = [], onLessonCreated }) {
  const { isRTL } = useLanguage();

  const availableTopics = (topics && topics.length > 0) ? topics : TOPICS;
  const [topicId, setTopicId] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [notesEn, setNotesEn] = useState('');
  const [notesAr, setNotesAr] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [recordingLink, setRecordingLink] = useState('');
  const [arabicStatus, setArabicStatus] = useState('draft'); // 'draft' | 'approved' | 'pending'

  const effectiveTopicId = availableTopics.some((t) => t.id === topicId)
    ? topicId
    : (availableTopics[0]?.id || 'topic-1');

  const [isTranslating, setIsTranslating] = useState(false);
  const [translationNotice, setTranslationNotice] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Auto-generate Arabic draft via LibreTranslate helper
  const handleGenerateArabicDraft = async () => {
    if (!titleEn && !notesEn) {
      setErrorMsg(
        isRTL
          ? 'يرجى إدخال العنوان والملاحظات بالإنجليزية أولاً لإنشاء المسودة.'
          : 'Please enter English title or notes first to generate the Arabic draft.'
      );
      return;
    }

    setIsTranslating(true);
    setErrorMsg('');
    setTranslationNotice('');

    try {
      const data = await api.generateArabicDraft({ titleEn, notesEn });
      if (data.titleArDraft) setTitleAr(data.titleArDraft);
      if (data.notesArDraft) setNotesAr(data.notesArDraft);

      if (data.serviceAvailable) {
        setTranslationNotice(isRTL ? 'تم توليد المسودة عبر LibreTranslate.' : 'Draft generated via LibreTranslate.');
      } else {
        setTranslationNotice(
          isRTL
            ? 'خدمة الترجمة غير متاحة حالياً، تم توليد مسودة أولية ووضعها كـ "قيد المراجعة".'
            : 'Machine translation service offline; generated draft template marked as pending review.'
        );
        setArabicStatus('pending');
      }
    } catch {
      setTranslationNotice(isRTL ? 'تعذر الاتصال بخدمة الترجمة؛ يمكنك إدخال الترجمة يدوياً.' : 'Translation service unreachable; you can enter Arabic manually.');
      setArabicStatus('pending');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!titleEn.trim() || !notesEn.trim() || !codeSnippet.trim()) {
      setErrorMsg(isRTL ? 'العنوان الإنجليزي، الملاحظات، وكود بايثون حقول إجبارية.' : 'English title, notes, and code snippet are required.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        topicId: effectiveTopicId,
        titleEn,
        titleAr: titleAr.trim() || titleEn.trim(),
        notesEn,
        notesAr: notesAr.trim() || notesEn.trim(),
        codeSnippet,
        recordingLink: recordingLink.trim() || null,
        arabicStatus,
      };

      const result = await api.createLesson(payload);
      const created = result?.lesson ? {
        ...result.lesson,
        topicId: result.lesson.topic_id || result.lesson.topicId || payload.topicId,
        titleEn: result.lesson.title_en || result.lesson.titleEn || payload.titleEn,
        titleAr: result.lesson.title_ar || result.lesson.titleAr || payload.titleAr,
        notesEn: result.lesson.notes_en || result.lesson.notesEn || payload.notesEn,
        notesAr: result.lesson.notes_ar || result.lesson.notesAr || payload.notesAr,
        codeSnippet: result.lesson.code_snippet || result.lesson.codeSnippet || payload.codeSnippet,
      } : {
        id: `lesson-${Date.now()}`,
        ...payload,
      };

      try {
        const custom = JSON.parse(localStorage.getItem('hemma_custom_lessons') || '[]');
        const updated = [created, ...custom.filter((l) => l.id !== created.id)];
        localStorage.setItem('hemma_custom_lessons', JSON.stringify(updated));
      } catch {
        // Ignore local storage error
      }

      if (onLessonCreated) {
        onLessonCreated(created);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save lesson.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#151d30] rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
              {isRTL ? 'منشئ المحتوى التعليمي' : 'Curriculum Authoring'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {isRTL ? 'إضافة درس برمجي جديد ومسودة عربية' : 'Create Lesson & Bilingual Content'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {translationNotice && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{translationNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Target Topic & External Recording Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                {isRTL ? 'اختر الوحدة / المحور' : 'Course Module / Topic'}
              </label>
              <select
                value={effectiveTopicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                {availableTopics.map((t) => {
                  const label = isRTL
                    ? (t.titleAr || t.title_ar || t.titleEn || t.title_en || t.title || t.id)
                    : (t.titleEn || t.title_en || t.title || t.titleAr || t.id);
                  return (
                    <option key={t.id} value={t.id} className="text-slate-800 dark:text-slate-100 py-1">
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                {isRTL ? 'رابط تسجيل الجلسة المباشرة (Zoom / Google Meet)' : 'Live Session Recording URL'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Video className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  dir="ltr"
                  value={recordingLink}
                  onChange={(e) => setRecordingLink(e.target.value)}
                  placeholder="https://meet.google.com/xyz-hemma-demo"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 text-xs font-mono ltr-forced focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* English Input Section */}
          <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Primary English Content</span>
              </span>

              {/* Machine Translation Trigger Button */}
              <button
                type="button"
                onClick={handleGenerateArabicDraft}
                disabled={isTranslating}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {isTranslating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{isRTL ? 'توليد مسودة ترجمة عربية' : 'Generate Arabic Draft'}</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Lesson Title (English) *
              </label>
              <input
                type="text"
                dir="ltr"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Dictionaries & Key-Value Pair Mapping"
                required
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-sans ltr-forced bg-white dark:bg-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Conceptual Notes & Theory (English) *
              </label>
              <textarea
                rows={3}
                dir="ltr"
                value={notesEn}
                onChange={(e) => setNotesEn(e.target.value)}
                placeholder="Explain the theoretical foundations, syntax rules, and use cases..."
                required
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-sans ltr-forced bg-white dark:bg-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
              ></textarea>
            </div>
          </div>

          {/* Arabic Draft & Review Workflow Section */}
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>{isRTL ? 'المسودة العربية والمراجعة' : 'Arabic Translation Draft'}</span>
              </span>

              {/* Status Radio Pills: draft | approved | pending */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mr-1">Status:</span>
                {[
                  { key: 'draft', label: 'Draft / مسودة' },
                  { key: 'approved', label: 'Approved / معتمد' },
                  { key: 'pending', label: 'Pending / قيد المراجعة' },
                ].map((s) => (
                  <button
                    type="button"
                    key={s.key}
                    onClick={() => setArabicStatus(s.key)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      arabicStatus === s.key
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isRTL ? 'عنوان الدرس (بالعربية)' : 'Lesson Title (Arabic Draft)'}
              </label>
              <input
                type="text"
                dir="rtl"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="عنوان الدرس المترجم..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-sans bg-white dark:bg-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isRTL ? 'الملاحظات والشرح المفاهيمي (بالعربية)' : 'Conceptual Notes (Arabic Draft)'}
              </label>
              <textarea
                rows={3}
                dir="rtl"
                value={notesAr}
                onChange={(e) => setNotesAr(e.target.value)}
                placeholder="شرح المفاهيم البرمجية بالعربية لمراجعة واعتماد الأستاذ..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-sans bg-white dark:bg-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
              ></textarea>
            </div>
          </div>

          {/* Python Code Snippet (Strictly LTR) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Code className="w-4 h-4 text-emerald-600" />
                <span>Python Code Snippet (Strictly LTR) *</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">python3</span>
            </div>
            <textarea
              rows={5}
              dir="ltr"
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder={`# Example Python code\ndef calculate_discount(price, rate):\n    return price * (1 - rate)\n\nprint(calculate_discount(100, 0.15))`}
              required
              className="w-full p-3.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-100 font-mono text-xs ltr-forced focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
            ></textarea>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{isRTL ? 'نشر الدرس وحفظ المحتوى' : 'Publish & Save Lesson'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
