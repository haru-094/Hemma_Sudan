import { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
} from 'lucide-react';

export default function TopicQuiz({ quiz, onComplete, onProceedToAssignment }) {
  const { isRTL, language } = useLanguage();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Guard: onComplete fires at most once per quiz session (survives retries)
  const hasRecordedRef = useRef(false);

  const handleSelect = (questionId, optionIndex) => {
    if (isSubmitted) return; // Prevent changing after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const score = calculateScore();
    // Only fire onComplete once per quiz session — not on each retry
    if (onComplete && !hasRecordedRef.current) {
      hasRecordedRef.current = true;
      onComplete(score, quiz.questions.length);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    // hasRecordedRef intentionally NOT reset — progress is already queued
  };

  const allAnswered = quiz.questions.every((q) => selectedAnswers[q.id] !== undefined);
  const score = calculateScore();
  const total = quiz.questions.length;
  const isPassed = score / total >= 0.6;

  return (
    <div className="bg-white dark:bg-[#151d30] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 mb-1">
            {isRTL ? 'تقييم مفاهيم غير متصل' : 'Offline Knowledge Check'}
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {language === 'ar' ? quiz.titleAr : quiz.titleEn}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isRTL
              ? 'اختبر استيعابك للمفاهيم السابقة قبل البدء في كتابة مشروع الوحدة.'
              : 'Test your understanding of the module concepts before starting the assignment.'}
          </p>
        </div>

        {isSubmitted && (
          <div
            className={`px-4 py-2 rounded-xl text-center font-bold text-xs border ${
              isPassed
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
            }`}
          >
            <div className="text-base font-extrabold">
              {score} / {total}
            </div>
            <span>{isPassed ? (isRTL ? 'مستوى ممتاز!' : 'Great Job!') : (isRTL ? 'راجع وحاول مجدداً' : 'Review & Retry')}</span>
          </div>
        )}
      </div>

      {/* Questions list */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {quiz.questions.map((q, idx) => {
          const selected = selectedAnswers[q.id];
          const isCorrect = selected === q.correctIndex;
          const options = language === 'ar' ? q.optionsAr : q.optionsEn;

          return (
            <div
              key={q.id}
              className={`p-5 rounded-xl border transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/30'
                    : 'border-rose-300 dark:border-rose-800/80 bg-rose-50/40 dark:bg-rose-950/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="space-y-2 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                    {language === 'ar' ? q.questionAr : q.questionEn}
                  </h4>

                  {/* Code snippet if present */}
                  {q.codeSnippet && (
                    <div
                      dir="ltr"
                      className="ltr-forced rounded-lg bg-slate-950 text-slate-100 p-3 text-xs font-mono border border-slate-800 my-2"
                    >
                      <pre className="m-0 leading-tight">
                        <code>{q.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* Multiple Choice Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {options.map((opt, optIdx) => {
                      const isOptionSelected = selected === optIdx;
                      const isThisCorrect = optIdx === q.correctIndex;

                      let optClasses = 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-600';
                      if (isSubmitted) {
                        if (isThisCorrect) {
                          optClasses = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold dark:border-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-200';
                        } else if (isOptionSelected && !isThisCorrect) {
                          optClasses = 'border-rose-500 bg-rose-50 text-rose-900 dark:border-rose-600 dark:bg-rose-950/80 dark:text-rose-200';
                        } else {
                          optClasses = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-500';
                        }
                      } else if (isOptionSelected) {
                        optClasses = 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-600 dark:border-emerald-500 dark:bg-emerald-950/80 dark:text-emerald-200 dark:ring-emerald-500';
                      }

                      return (
                        <button
                          type="button"
                          key={optIdx}
                          onClick={() => handleSelect(q.id, optIdx)}
                          className={`p-3 rounded-xl border text-xs text-left rtl:text-right flex items-center justify-between gap-2 transition-all cursor-pointer ${optClasses}`}
                        >
                          <span className="leading-snug">{opt}</span>
                          {isSubmitted && isThisCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          )}
                          {isSubmitted && isOptionSelected && !isThisCorrect && (
                            <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation reveal after submission */}
                  {isSubmitted && (
                    <div className="mt-3 p-3 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <strong className="text-slate-900 dark:text-slate-100 block font-semibold">
                        {isRTL ? 'الشرح والتوضيح:' : 'Explanation:'}
                      </strong>
                      <p>{language === 'ar' ? q.explanationAr : q.explanationEn}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Footer actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          {!isSubmitted ? (
            <button
              type="submit"
              disabled={!allAnswered}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all ${
                allAnswered
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              {isRTL ? 'التحقق من الإجابات' : 'Check Answers'}
            </button>
          ) : (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleRetry}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isRTL ? 'إعادة المحاولة' : 'Try Again'}</span>
              </button>

              {onProceedToAssignment && (
                <button
                  type="button"
                  onClick={onProceedToAssignment}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>{isRTL ? 'الانتقال إلى مشروع الوحدة' : 'Proceed to Project'}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          <span className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">
            {isRTL ? 'يعمل دون الحاجة إلى إنترنت' : 'Evaluated locally without internet connection'}
          </span>
        </div>
      </form>
    </div>
  );
}

