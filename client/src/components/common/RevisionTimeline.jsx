import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import StatusBadge from '../common/StatusBadge';
import GithubIcon from '../common/GithubIcon';
import { 
  History, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

export default function RevisionTimeline({ attempts = [] }) {
  const { isRTL } = useLanguage();
  const [expandedAttempt, setExpandedAttempt] = useState(attempts[attempts.length - 1]?.attemptNo || 1);

  if (!attempts || attempts.length === 0) {
    return null;
  }

  const sortedAttempts = [...attempts].sort((a, b) => b.attemptNo - a.attemptNo);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            {isRTL ? 'سجل المحاولات والنسخ السابقة' : 'Revision History & Attempts'}
          </h3>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
          {attempts.length} {isRTL ? 'محاولات' : attempts.length === 1 ? 'attempt' : 'attempts'}
        </span>
      </div>

      <div className="relative border-l-2 rtl:border-r-2 rtl:border-l-0 border-slate-200 ml-4 rtl:mr-4 rtl:ml-0 space-y-6 pt-2">
        {sortedAttempts.map((attempt) => {
          const isExpanded = expandedAttempt === attempt.attemptNo;
          const isLatest = attempt.attemptNo === Math.max(...attempts.map((a) => a.attemptNo));

          return (
            <div key={attempt.id || attempt.attemptNo} className="relative pl-6 rtl:pr-6 rtl:pl-0">
              {/* Timeline marker icon */}
              <div
                className={`absolute -left-[17px] rtl:-right-[17px] top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                  isLatest
                    ? 'bg-emerald-600 border-white text-white shadow-md ring-2 ring-emerald-300'
                    : 'bg-white border-slate-300 text-slate-600'
                }`}
              >
                #{attempt.attemptNo}
              </div>

              {/* Attempt card header */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedAttempt(isExpanded ? null : attempt.attemptNo)}
                  className="w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left rtl:text-right hover:bg-slate-100/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-slate-900">
                      {isRTL ? `المحاولة رقم #${attempt.attemptNo}` : `Attempt #${attempt.attemptNo}`}
                    </span>
                    {isLatest && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {isRTL ? 'الأحدث' : 'Latest'}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleDateString() : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={attempt.status} />
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded attempt details & feedback history */}
                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-slate-200 space-y-4 text-xs">
                    {/* Repository Link & Explanation */}
                    <div className="bg-white rounded-lg p-3 border border-slate-200 space-y-2 font-mono">
                      <div className="flex items-center gap-2">
                        <GithubIcon className="w-4 h-4 text-slate-700" />
                        <span className="font-semibold text-slate-700">{isRTL ? 'المستودع:' : 'Repository:'}</span>
                        <a
                          href={attempt.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:underline ltr-forced truncate max-w-xs sm:max-w-md"
                        >
                          {attempt.githubLink}
                        </a>
                      </div>

                      <div className="font-sans text-slate-700 pt-1 border-t border-slate-100">
                        <strong className="block text-slate-900 mb-0.5">
                          {isRTL ? 'الشرح والمنهجية المقدمة:' : 'Submitted Explanation:'}
                        </strong>
                        <p className="leading-relaxed whitespace-pre-line">{attempt.explanation}</p>
                      </div>
                    </div>

                    {/* Feedbacks associated with this attempt */}
                    {attempt.feedbacks && attempt.feedbacks.length > 0 ? (
                      <div className="space-y-2.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          {isRTL ? 'الملاحظات والقرارات لهذه المحاولة:' : 'Feedback for this attempt:'}
                        </span>
                        {attempt.feedbacks.map((fb, idx) => (
                          <div
                            key={fb.id || idx}
                            className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                              fb.kind === 'revision_request'
                                ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                                : fb.kind === 'escalation_resolution'
                                ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
                                : 'bg-teal-50/70 border-teal-200 text-teal-900'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold text-[11px]">
                              <div className="flex items-center gap-2">
                                <span>{fb.author_name || fb.author || (isRTL ? 'المراجع' : 'Reviewer')}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                  fb.kind === 'revision_request'
                                    ? 'bg-amber-100 text-amber-800'
                                    : fb.kind === 'escalation_resolution'
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : 'bg-teal-100 text-teal-800'
                                }`}>
                                  {isRTL
                                    ? fb.kind === 'revision_request'
                                      ? 'طلب تعديل'
                                      : fb.kind === 'escalation_resolution'
                                      ? 'قرار الأستاذ'
                                      : 'ملاحظات'
                                    : fb.kind === 'revision_request'
                                    ? 'Revision Request'
                                    : fb.kind === 'escalation_resolution'
                                    ? 'Teacher Resolution'
                                    : 'Feedback'}
                                </span>
                              </div>
                              <span className="font-normal text-[10px] opacity-75">
                                {fb.created_at ? new Date(fb.created_at).toLocaleTimeString() : ''}
                              </span>
                            </div>
                            <p className="leading-relaxed">{fb.comment || fb.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-500 text-[11px] text-center">
                        {isRTL ? 'لا توجد ملاحظات مسجلة بعد لهذه النسخة.' : 'No feedback entries recorded yet for this attempt.'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
