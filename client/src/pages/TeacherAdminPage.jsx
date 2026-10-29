import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { TOPICS, LESSONS, INITIAL_SUBMISSIONS } from '../data/mockData';
import StatusBadge from '../components/common/StatusBadge';
import { 
  ShieldCheck, 
  UserCheck, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Key, 
  BookOpen, 
  Globe, 
  RotateCcw,
  Check
} from 'lucide-react';

export default function TeacherAdminPage() {
  const { t, isRTL, language } = useLanguage();
  const { currentUser, isTeacher } = useAuth();

  // State of mentor approvals: map mentorId -> array of approved topicIds
  const [mentorApprovals, setMentorApprovals] = useState({
    'usr-mentor-1': ['topic-1', 'topic-2'],
    'usr-mentor-2': ['topic-2', 'topic-3'],
    'usr-mentor-3': ['topic-1'],
  });

  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [activeTab, setActiveTab] = useState('mentors'); // 'mentors' | 'escalations' | 'lessons' | 'accounts'

  // Escalated submissions
  const escalations = submissions.filter((s) => s.status === 'escalated');

  // Toggle mentor approval for topic (FR-8.2 & FR-8.3)
  const toggleMentorTopic = (mentorId, topicId) => {
    setMentorApprovals((prev) => {
      const currentList = prev[mentorId] || [];
      const updated = currentList.includes(topicId)
        ? currentList.filter((id) => id !== topicId) // Revoke
        : [...currentList, topicId]; // Grant
      return { ...prev, [mentorId]: updated };
    });
  };

  // Teacher resolves escalation (BR-5)
  const handleResolveEscalation = (subId, outcome) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === subId
          ? {
              ...sub,
              status: outcome === 'approve' ? 'feedback_given' : 'revision_requested',
            }
          : sub
      )
    );
  };

  if (!isTeacher) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">
          {isRTL ? 'غير مصرح بالدخول' : 'Access Restricted'}
        </h2>
        <p className="text-sm text-slate-600">
          {isRTL
            ? 'هذه اللوحة مخصصة لأستاذ المادة لإدارة المرشدين وحل حالات التصعيد.'
            : 'This dashboard is reserved for the Course Lead (Teacher) to manage mentor approvals and resolve escalations.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isRTL ? 'مركز إدارة الأستاذ' : 'Teacher Course Hub'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Course Lead
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isRTL
              ? 'إدارة اعتماد المرشدين، البت في طلبات التصعيد، وضبط المحتوى التعليمي ثنائي اللغة'
              : 'Approve & revoke mentors by topic, resolve escalations, and manage bilingual curriculum.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('mentors')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'mentors' ? 'bg-white shadow-sm text-slate-900 font-bold' : 'text-slate-600'
            }`}
          >
            {isRTL ? 'اعتماد المرشدين' : 'Mentor Approvals'}
          </button>
          <button
            onClick={() => setActiveTab('escalations')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'escalations' ? 'bg-white shadow-sm text-slate-900 font-bold' : 'text-slate-600'
            }`}
          >
            <span>{isRTL ? 'التصعيدات' : 'Escalations'}</span>
            {escalations.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center">
                {escalations.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'accounts' ? 'bg-white shadow-sm text-slate-900 font-bold' : 'text-slate-600'
            }`}
          >
            {isRTL ? 'الحسابات والدعم' : 'Accounts & Reset'}
          </button>
        </div>
      </div>

      {/* Tab 1: Mentor Approvals Matrix (FR-8.1, FR-8.2, FR-8.3) */}
      {activeTab === 'mentors' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <span>{isRTL ? 'مصفوفة اعتماد المرشدين حسب المواضيع' : 'Topic-Based Mentor Approvals'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {isRTL
                ? 'وفقاً لقواعد النظام (BR-2)، الأستاذ هو المخول الوحيد بمنح وإلغاء صلاحيات التقييم للمرشدين لكل وحدة.'
                : 'Per SRS BR-2, only the teacher can approve or revoke mentor permissions for specific topics.'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="p-3.5 font-bold">{isRTL ? 'اسم المرشد والجامعة' : 'Mentor & Institution'}</th>
                  {TOPICS.map((topic) => (
                    <th key={topic.id} className="p-3.5 font-bold text-center">
                      {isRTL ? `المحور ${topic.displayOrder}` : `Topic ${topic.displayOrder}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DEMO_USERS.filter((u) => u.role === 'mentor').map((mentor) => {
                  const approved = mentorApprovals[mentor.id] || [];

                  return (
                    <tr key={mentor.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{mentor.name}</div>
                        <div className="text-[11px] text-slate-500">{mentor.university}</div>
                      </td>

                      {TOPICS.map((topic) => {
                        const isApproved = approved.includes(topic.id);

                        return (
                          <td key={topic.id} className="p-3.5 text-center">
                            <button
                              onClick={() => toggleMentorTopic(mentor.id, topic.id)}
                              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors inline-flex items-center gap-1 ${
                                isApproved
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                              }`}
                            >
                              {isApproved ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>{isRTL ? 'معتمد' : 'Approved'}</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{isRTL ? 'غير معتمد' : 'Revoked'}</span>
                                </>
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Escalations Queue (FR-10.1 & BR-5) */}
      {activeTab === 'escalations' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>{isRTL ? 'طلبات التصعيد المحالة للأستاذ' : 'Escalation Resolution Queue'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {isRTL
                ? 'الحالات التي تم تصعيدها من قبل المرشد أو الطالب للبت فيها وإصدار التقييم النهائي.'
                : 'Submissions escalated by mentors or learners requiring final instructor determination.'}
            </p>
          </div>

          {escalations.length === 0 ? (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <CheckCircle className="w-10 h-10 mx-auto text-emerald-500" />
              <p className="text-sm font-medium">
                {isRTL ? 'لا توجد حالات تصعيد معلقة حالياً.' : 'No pending escalations.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {escalations.map((sub) => {
                const topic = TOPICS.find((t) => t.id === (sub.topicId || LESSONS.find((l) => l.id === sub.lessonId)?.topicId));

                return (
                  <div
                    key={sub.id}
                    className="border border-rose-200 bg-rose-50/20 rounded-xl p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          {language === 'ar'
                            ? sub.assignmentTitleAr || topic?.assignment?.titleAr
                            : sub.assignmentTitleEn || topic?.assignment?.titleEn}
                        </h4>
                        <span className="text-xs text-slate-500">
                          Learner: <strong className="text-slate-800">{sub.learnerName}</strong>
                        </span>
                      </div>
                      <StatusBadge status={sub.status} />
                    </div>

                    <div className="bg-white rounded-lg p-3 text-xs border border-rose-100 space-y-1 font-mono">
                      <div>
                        <span className="font-semibold text-slate-700">Code URL: </span>
                        <a
                          href={sub.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:underline ltr-forced"
                        >
                          {sub.githubLink}
                        </a>
                      </div>
                      <p className="font-sans text-slate-700 pt-1">
                        <strong>Explanation: </strong> {sub.explanation}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => handleResolveEscalation(sub.id, 'approve')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                        <span>{isRTL ? 'اعتماد الحل وتأكيد الإنجاز' : 'Resolve & Confirm Complete'}</span>
                      </button>

                      <button
                        onClick={() => handleResolveEscalation(sub.id, 'revise')}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>{isRTL ? 'إرجاع للطالب مع طلب تعديل' : 'Request Revision'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Accounts & Manual Reset (FR-13.1) */}
      {activeTab === 'accounts' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-teal-600" />
              <span>{isRTL ? 'إدارة استعادة الحسابات اليدوية' : 'Manual Account Reset Protocol'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {isRTL
                ? 'وفقاً لـ (FR-13.1)، لا توجد استعادة تلقائية لكلمات المرور عبر البريد، ويتم التوجيه للأستاذ يدوياً.'
                : 'Per SRS FR-13.1, automated email password reset is out of scope. Locked accounts must be reset manually by the teacher.'}
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-slate-900">
              {isRTL ? 'تعليمات وإجراءات إعادة تعيين الحساب' : 'Standard Reset Procedure'}
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              When a student contacts you regarding lost access, verify their university matriculation ID or student status, then reset their credentials directly through the backend or database registry. All manual resets are recorded in the audit log with timestamp per NFR-13.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

