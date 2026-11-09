import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { TOPICS, LESSONS, INITIAL_SUBMISSIONS } from '../data/mockData';
import { api } from '../services/api';
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
  Check,
  History,
  Lock
} from 'lucide-react';

export default function TeacherAdminPage() {
  const { t, isRTL, language } = useLanguage();
  const { currentUser, isTeacher } = useAuth();

  const [mentorApprovals, setMentorApprovals] = useState({
    'usr-mentor-1': ['topic-1', 'topic-2'],
    'usr-mentor-2': ['topic-2', 'topic-3'],
    'usr-mentor-3': ['topic-1'],
  });

  const [mentorsList, setMentorsList] = useState(
    DEMO_USERS.filter((u) => u.role === 'mentor' || u.role === 'learner')
  );

  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('mentors');
  const [resetTargetId, setResetTargetId] = useState('');
  const [tempPass, setTempPass] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const escalations = submissions.filter((s) => s.status === 'escalated');

  useEffect(() => {
    async function fetchTeacherData() {
      try {
        const data = await api.getTeacherMentors();
        if (data.mentors) {
          setMentorsList(data.mentors);
          const map = {};
          data.mentors.forEach((m) => {
            map[m.id] = m.approvedTopics || [];
          });
          setMentorApprovals(map);
        }
      } catch (err) {
        // Fallback for offline or local preview
      }

      try {
        const logsData = await api.getAuditLogs();
        if (logsData.auditLogs) {
          setAuditLogs(logsData.auditLogs);
        }
      } catch (err) {
        // Fallback
      }
    }

    if (isTeacher) {
      fetchTeacherData();
    }
  }, [isTeacher]);

  const toggleMentorTopic = async (mentorId, topicId) => {
    const currentList = mentorApprovals[mentorId] || [];
    const isApproved = currentList.includes(topicId);
    const updated = isApproved
      ? currentList.filter((id) => id !== topicId)
      : [...currentList, topicId];

    setMentorApprovals((prev) => ({ ...prev, [mentorId]: updated }));

    try {
      await api.toggleMentorTopic({
        teacherId: currentUser?.id || 'usr-teacher-1',
        mentorId,
        topicId,
      });

      // Refresh audit logs
      const logsData = await api.getAuditLogs();
      if (logsData.auditLogs) setAuditLogs(logsData.auditLogs);
    } catch (err) {
      console.warn('Backend sync for mentor approval toggle skipped (offline/demo mode):', err.message);
    }
  };

  const handleResolveEscalation = async (subId, outcome) => {
    const nextStatus = outcome === 'approve' ? 'feedback_given' : 'revision_requested';
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === subId ? { ...sub, status: nextStatus } : sub))
    );

    try {
      await api.resolveEscalation(subId, {
        teacherId: currentUser?.id || 'usr-teacher-1',
        resolution: outcome === 'approve' ? 'complete' : 'revision_requested',
        comment: outcome === 'approve' ? 'Approved by Teacher upon review.' : 'Revision requested by Teacher.',
      });
    } catch (err) {
      console.warn('Backend resolve skipped:', err.message);
    }
  };

  const handleManualReset = async (e) => {
    e.preventDefault();
    if (!resetTargetId) return;

    try {
      await api.resetAccount({
        teacherId: currentUser?.id || 'usr-teacher-1',
        targetUserId: resetTargetId,
        newTemporaryPassword: tempPass || 'hemma2026',
      });
      setResetSuccess(
        isRTL
          ? `تمت إعادة تعيين كلمة المرور بنجاح للمستخدم. كلمة المرور المؤقتة: ${tempPass || 'hemma2026'}`
          : `Password reset successfully. Temporary password: ${tempPass || 'hemma2026'}`
      );
      setTempPass('');
      // Refresh logs
      const logsData = await api.getAuditLogs();
      if (logsData.auditLogs) setAuditLogs(logsData.auditLogs);
    } catch (err) {
      setResetSuccess(`Reset processed in local mode. Temporary password: ${tempPass || 'hemma2026'}`);
    }
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
      {/* Header */}
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
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'mentors' ? 'bg-white shadow-sm text-slate-900 font-bold' : 'text-slate-600'
            }`}
          >
            {isRTL ? 'اعتماد المرشدين' : 'Mentor Approvals'}
          </button>
          <button
            onClick={() => setActiveTab('escalations')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
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
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'accounts' ? 'bg-white shadow-sm text-slate-900 font-bold' : 'text-slate-600'
            }`}
          >
            {isRTL ? 'الحسابات والدعم' : 'Accounts & Reset'}
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'audit' ? 'bg-white shadow-sm text-slate-900 font-bold' : 'text-slate-600'
            }`}
          >
            {isRTL ? 'سجل الرقابة' : 'Audit Logs'}
          </button>
        </div>
      </div>

      {/* Tab 1: Mentor Approvals Matrix */}
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
            <table className="w-full text-left rtl:text-right text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="p-3.5 font-bold">{isRTL ? 'اسم المرشد والجامعة' : 'Mentor & Institution'}</th>
                  <th className="p-3.5 font-bold text-center">{isRTL ? 'الحالة الحالية' : 'Current Role'}</th>
                  {TOPICS.map((topic) => (
                    <th key={topic.id} className="p-3.5 font-bold text-center">
                      {isRTL ? `المحور ${topic.displayOrder}` : `Topic ${topic.displayOrder}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mentorsList.map((mentor) => {
                  const approved = mentorApprovals[mentor.id] || [];

                  return (
                    <tr key={mentor.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{mentor.name}</div>
                        <div className="text-[11px] text-slate-500">{mentor.university || 'University of Khartoum'}</div>
                      </td>

                      <td className="p-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          mentor.role === 'mentor' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {mentor.role}
                        </span>
                      </td>

                      {TOPICS.map((topic) => {
                        const isApproved = approved.includes(topic.id);

                        return (
                          <td key={topic.id} className="p-3.5 text-center">
                            <button
                              onClick={() => toggleMentorTopic(mentor.id, topic.id)}
                              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer ${
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

      {/* Tab 2: Escalations Queue */}
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
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>{isRTL ? 'اعتماد الحل وتأكيد الإنجاز' : 'Resolve & Confirm Complete'}</span>
                      </button>

                      <button
                        onClick={() => handleResolveEscalation(sub.id, 'revise')}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
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

      {/* Tab 3: Accounts & Manual Reset (FR-13.1, BR-7) */}
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

          {resetSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{resetSuccess}</span>
            </div>
          )}

          <form onSubmit={handleManualReset} className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">
              {isRTL ? 'تنفيذ إعادة تعيين كلمة مرور لطالب' : 'Reset Student Password'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRTL ? 'اختر حساب الطالب' : 'Select Learner Account'}
                </label>
                <select
                  value={resetTargetId}
                  onChange={(e) => setResetTargetId(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="">-- {isRTL ? 'اختر مستخدماً' : 'Select user'} --</option>
                  {DEMO_USERS.filter((u) => u.role === 'learner').map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRTL ? 'كلمة المرور المؤقتة الجديدة' : 'Temporary Password'}
                </label>
                <input
                  type="text"
                  value={tempPass}
                  onChange={(e) => setTempPass(e.target.value)}
                  placeholder="e.g. hemma2026"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-mono ltr-forced"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
            >
              {isRTL ? 'تأكيد وإعادة التعيين' : 'Apply Manual Reset'}
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Audit Logs (NFR-13) */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" />
              <span>{isRTL ? 'سجل الرقابة والعمليات الإدارية' : 'Administrative Audit Trail'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {isRTL
                ? 'توثيق طابع زمني دقيق لكل عملية منح أو إلغاء لصلاحيات المرشدين وإعادة تعيين الحسابات (NFR-13).'
                : 'Timestamped record of mentor approval/revocation and manual account resets per NFR-13.'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="p-3 font-bold">{isRTL ? 'التاريخ والوقت' : 'Timestamp'}</th>
                  <th className="p-3 font-bold">{isRTL ? 'نوع العملية' : 'Action'}</th>
                  <th className="p-3 font-bold">{isRTL ? 'المنفذ' : 'Performed By'}</th>
                  <th className="p-3 font-bold">{isRTL ? 'المستفيد' : 'Target User'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {auditLogs.length > 0 ? (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="p-3 text-slate-500 font-sans">{new Date(log.created_at).toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.action === 'MENTOR_APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.action === 'MENTOR_REVOKED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700 font-sans">{log.performed_by_name || log.performed_by}</td>
                      <td className="p-3 text-slate-700 font-sans">{log.target_user_name || log.target_user_id || '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-400 font-sans">
                      {isRTL ? 'لا توجد سجلات رقابة مسجلة حتى الآن.' : 'No audit records logged yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
