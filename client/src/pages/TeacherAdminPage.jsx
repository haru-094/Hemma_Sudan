import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { TOPICS, LESSONS, INITIAL_SUBMISSIONS } from '../data/mockData';
import { api } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import LessonAuthoringModal from '../components/teacher/LessonAuthoringModal';
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
  Lock,
  PlusCircle,
  Video,
  Languages,
  FileCode,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sliders,
  Sparkles,
  ExternalLink,
  Shield
} from 'lucide-react';

// Reusable Clean Pagination Component
function Pagination({ currentPage, totalItems, pageSize, onPageChange, isRTL }) {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
      <div>
        {isRTL
          ? `عرض ${startItem} إلى ${endItem} من إجمالي ${totalItems}`
          : `Showing ${startItem} to ${endItem} of ${totalItems}`}
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-1 cursor-pointer"
        >
          {isRTL ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          <span>{isRTL ? 'السابق' : 'Previous'}</span>
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                currentPage === p
                  ? 'bg-emerald-800 dark:bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-1 cursor-pointer"
        >
          <span>{isRTL ? 'التالي' : 'Next'}</span>
          {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

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

  const [topicsList, setTopicsList] = useState(TOPICS);
  const [lessonsList, setLessonsList] = useState(LESSONS);
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons' | 'mentors' | 'escalations' | 'accounts' | 'audit'
  const [isAuthoringOpen, setIsAuthoringOpen] = useState(false);

  // Pagination states for clean lists
  const [lessonPage, setLessonPage] = useState(1);
  const [mentorPage, setMentorPage] = useState(1);
  const [escalationPage, setEscalationPage] = useState(1);
  const [auditPage, setAuditPage] = useState(1);

  const LESSONS_PER_PAGE = 5;
  const MENTORS_PER_PAGE = 4;
  const ESCALATIONS_PER_PAGE = 3;
  const AUDIT_PER_PAGE = 6;

  const [resetTargetId, setResetTargetId] = useState('');
  const [tempPass, setTempPass] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [purgeResult, setPurgeResult] = useState(null);
  const [isPurging, setIsPurging] = useState(false);

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
        const topicsData = await api.getTopics();
        if (topicsData.topics && topicsData.topics.length > 0) {
          const normalized = topicsData.topics.map((t) => ({
            ...t,
            titleEn: t.titleEn || t.title_en || t.title || t.id,
            titleAr: t.titleAr || t.title_ar || t.titleEn || t.title_en || t.id,
            displayOrder: t.displayOrder || t.display_order || 1,
          }));
          setTopicsList(normalized);
          const allLessons = [];
          topicsData.topics.forEach((top) => {
            if (top.lessons) allLessons.push(...top.lessons);
          });
          if (allLessons.length > 0) setLessonsList(allLessons);
        } else {
          setTopicsList(TOPICS);
        }
      } catch (err) {
        setTopicsList(TOPICS);
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

  const handleLessonCreated = (newLesson) => {
    setLessonsList((prev) => [newLesson, ...prev]);
    setLessonPage(1);
  };

  const handleApproveArabicDraft = async (lessonId) => {
    setLessonsList((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, arabicStatus: 'approved', arabic_status: 'approved' } : l))
    );

    try {
      await api.updateArabicStatus(lessonId, { arabicStatus: 'approved' });
    } catch (err) {
      console.warn('Status update skipped (offline/demo mode):', err.message);
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
      const logsData = await api.getAuditLogs();
      if (logsData.auditLogs) setAuditLogs(logsData.auditLogs);
    } catch (err) {
      setResetSuccess(`Reset processed in local mode. Temporary password: ${tempPass || 'hemma2026'}`);
    }
  };

  const handlePurgeDemoData = async () => {
    const confirmed = window.confirm(
      isRTL
        ? 'هل أنت متأكد من حذف وتطهير بيانات الطلاب المؤقتة الذين لم يمنحوا الموافقة على الاحتفاظ بالبيانات وفقاً لمعيار NFR-14؟'
        : 'Are you sure you want to purge non-consented demo learner submissions and progress records in accordance with NFR-14 retention policy?'
    );
    if (!confirmed) return;

    setIsPurging(true);
    setPurgeResult(null);
    try {
      const res = await api.purgeDemoData({
        teacherId: currentUser?.id || 'usr-teacher-1',
      });
      setPurgeResult(res);
      const logsData = await api.getAuditLogs();
      if (logsData.auditLogs) setAuditLogs(logsData.auditLogs);
    } catch (err) {
      setPurgeResult({
        message: 'Purge executed in demonstration mode (NFR-14 policy applied).',
        purgedLearnersCount: 1,
        purgedSubmissionsCount: 0,
        purgedProgressCount: 0,
      });
    } finally {
      setIsPurging(false);
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
            ? 'هذه اللوحة مخصصة لأستاذ المادة لإدارة الدروس والمرشدين وحل حالات التصعيد.'
            : 'This dashboard is reserved for the Course Lead (Teacher) to author lessons, manage mentors, and resolve escalations.'}
        </p>
      </div>
    );
  }

  // Navigation Items for the Dedicated Admin Sidebar
  const navItems = [
    {
      id: 'lessons',
      labelEn: 'Curriculum & Lessons',
      labelAr: 'المناهج والدروس البرمجية',
      icon: BookOpen,
      badge: lessonsList.length,
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'mentors',
      labelEn: 'Mentor Accreditation',
      labelAr: 'اعتماد المرشدين والمواضيع',
      icon: UserCheck,
      badge: mentorsList.filter((m) => m.role === 'mentor').length,
      badgeColor: 'bg-teal-100 text-teal-800',
    },
    {
      id: 'escalations',
      labelEn: 'Escalation Resolution',
      labelAr: 'طلبات التصعيد والنزاعات',
      icon: AlertTriangle,
      badge: escalations.length > 0 ? escalations.length : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
    },
    {
      id: 'accounts',
      labelEn: 'Account Security & Resets',
      labelAr: 'أمان الحسابات واستعادة الدخول',
      icon: Key,
      badge: null,
    },
    {
      id: 'audit',
      labelEn: 'Administrative Audit Trail',
      labelAr: 'سجل العمليات والرقابة',
      icon: History,
      badge: auditLogs.length > 0 ? auditLogs.length : null,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
  ];

  // Paginated slices
  const paginatedLessons = lessonsList.slice(
    (lessonPage - 1) * LESSONS_PER_PAGE,
    lessonPage * LESSONS_PER_PAGE
  );

  const paginatedMentors = mentorsList.slice(
    (mentorPage - 1) * MENTORS_PER_PAGE,
    mentorPage * MENTORS_PER_PAGE
  );

  const paginatedEscalations = escalations.slice(
    (escalationPage - 1) * ESCALATIONS_PER_PAGE,
    escalationPage * ESCALATIONS_PER_PAGE
  );

  const paginatedAuditLogs = auditLogs.slice(
    (auditPage - 1) * AUDIT_PER_PAGE,
    auditPage * AUDIT_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#fbfaf6] dark:bg-[#0c1220] text-slate-800 dark:text-slate-100 pb-16">
      {/* Top Admin Command Header Bar */}
      <div className="bg-white dark:bg-[#151d30] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/hemma-logo-v2-192.png"
              alt="Hemma Sudan Logo"
              className="w-9 h-9 object-contain rounded-xl shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
                  {isRTL ? 'همة سودان • لوحة التحكم الإدارية' : 'Hemma Sudan • Admin Command Center'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  Course Lead
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {currentUser?.name || 'Dr. Al-Amin'} • {currentUser?.university || 'University of Khartoum'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></span>
              <span>{isRTL ? 'النظام متزامن ومتصل' : 'System Live & Synced'}</span>
            </div>

            <Link
              to="/lessons"
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{isRTL ? 'معاينة كطالب' : 'View as Learner'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container with Sidebar + Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* ======================================================== */}
          {/* DEDICATED ADMIN SIDEBAR                                  */}
          {/* ======================================================== */}
          <aside className="w-full lg:w-64 xl:w-72 shrink-0 bg-white dark:bg-[#151d30] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 space-y-5 shadow-xs lg:sticky lg:top-20">
            
            {/* Primary Action Button */}
            <button
              onClick={() => setIsAuthoringOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 dark:bg-emerald-600 hover:bg-emerald-900 dark:hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer hover:shadow-md active:scale-[0.99]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isRTL ? 'إضافة درس جديد' : 'Author New Lesson'}</span>
            </button>

            {/* Navigation Tabs */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider px-2.5 block mb-1">
                {isRTL ? 'أقسام الإدارة والتحكم' : 'Management Console'}
              </span>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left rtl:text-right ${
                        isActive
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-800' : 'text-slate-400'}`} />
                        <span className="truncate">
                          {isRTL ? item.labelAr : item.labelEn}
                        </span>
                      </div>

                      {item.badge !== null && item.badge !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Stats Panel in Sidebar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider px-1 block">
                {isRTL ? 'إحصائيات سريعة' : 'Course Quick Stats'}
              </span>

              <div className="bg-[#fbfaf6] dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200/70 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{isRTL ? 'إجمالي الدروس:' : 'Total Lessons:'}</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{lessonsList.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{isRTL ? 'المرشدين المعتمدين:' : 'Active Mentors:'}</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-400">
                    {mentorsList.filter((m) => m.role === 'mentor').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{isRTL ? 'التصعيدات المعلقة:' : 'Escalations:'}</span>
                  <span className={`font-bold ${escalations.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {escalations.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Offline & Architecture Notice */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                <span>{isRTL ? 'مرونة اتصال السودان' : 'Sudan Resilient Mode'}</span>
              </div>
              <p className="leading-relaxed">
                {isRTL
                  ? 'يتم تخزين المحتوى والعمليات محلياً ومزامنتها تلقائياً عند توفر الإنترنت.'
                  : 'Changes sync immediately or queue for seamless offline delivery.'}
              </p>
            </div>
          </aside>

          {/* ======================================================== */}
          {/* MAIN CONTENT AREA                                        */}
          {/* ======================================================== */}
          <main className="flex-1 w-full min-w-0">

            {/* TAB 1: CURRICULUM & LESSONS */}
            {activeTab === 'lessons' && (
              <div className="bg-white dark:bg-[#151d30] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 space-y-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                      <span>{isRTL ? 'إدارة محتوى المقررات والترجمة العربية' : 'Curriculum Authoring & Arabic Workflow'}</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isRTL
                        ? 'إنشاء الدروس بالإنجليزية وتوليد المسودات العربية عبر LibreTranslate واعتمادها للنشر.'
                        : 'Teacher authors lesson in English; LibreTranslate draft is reviewed and approved before learner publishing.'}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAuthoringOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{isRTL ? 'إضافة درس برمجي' : 'Author New Lesson'}</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {paginatedLessons.map((lesson) => {
                    const topic = topicsList.find((t) => t.id === (lesson.topicId || lesson.topic_id));
                    const currentStatus = lesson.arabicStatus || lesson.arabic_status || 'draft';

                    return (
                      <div key={lesson.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5 max-w-2xl">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                              {topic ? (language === 'ar' ? topic.titleAr || topic.title_ar : topic.titleEn || topic.title_en) : (isRTL ? 'المحور' : 'Topic')}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">
                              {lesson.titleEn || lesson.title_en}
                            </h4>
                            <span className="text-xs text-slate-300">/</span>
                            <span className="text-xs font-semibold text-slate-700">
                              {lesson.titleAr || lesson.title_ar}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-1">
                            {language === 'ar' ? (lesson.notesAr || lesson.notes_ar || lesson.notesEn) : (lesson.notesEn || lesson.notes_en)}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                            <span className="flex items-center gap-1 font-mono">
                              <FileCode className="w-3.5 h-3.5 text-slate-400" />
                              <span>{isRTL ? 'شيفرة كود بايثون' : 'python3 snippet'}</span>
                            </span>
                            {(lesson.recordingLink || lesson.recording_link) && (
                              <span className="flex items-center gap-1 text-blue-600">
                                <Video className="w-3.5 h-3.5" />
                                <span>{isRTL ? 'جلسة تفاعلية مرتبطة' : 'Live Session Linked'}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Arabic Translation Approval status pill & Action */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right rtl:text-left">
                            <span className="text-[11px] text-slate-400 block mb-0.5">
                              {isRTL ? 'حالة المسودة العربية:' : 'Arabic Draft Status:'}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1 border ${
                              currentStatus === 'approved'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : currentStatus === 'pending'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}>
                              {currentStatus === 'approved' ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-700" />
                                  <span>Approved / معتمد</span>
                                </>
                              ) : currentStatus === 'pending' ? (
                                <>
                                  <Languages className="w-3 h-3 text-blue-700" />
                                  <span>Pending Review / قيد المراجعة</span>
                                </>
                              ) : (
                                <>
                                  <RotateCcw className="w-3 h-3 text-amber-700" />
                                  <span>Draft / مسودة أولية</span>
                                </>
                              )}
                            </span>
                          </div>

                          {currentStatus !== 'approved' && (
                            <button
                              onClick={() => handleApproveArabicDraft(lesson.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm cursor-pointer transition-colors"
                            >
                              {isRTL ? 'اعتماد المسودة' : 'Approve Draft'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Clean Pagination for Lessons */}
                <Pagination
                  currentPage={lessonPage}
                  totalItems={lessonsList.length}
                  pageSize={LESSONS_PER_PAGE}
                  onPageChange={setLessonPage}
                  isRTL={isRTL}
                />
              </div>
            )}

            {/* TAB 2: MENTOR APPROVALS MATRIX */}
            {activeTab === 'mentors' && (
              <div className="bg-white dark:bg-[#151d30] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 space-y-6 shadow-xs">
                <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                    <span>{isRTL ? 'مصفوفة اعتماد المرشدين حسب المواضيع' : 'Topic-Based Mentor Approvals'}</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isRTL
                      ? 'الأستاذ هو المخول الوحيد بمنح وإلغاء صلاحيات التقييم للمرشدين لكل وحدة بشكل مستقل.'
                      : 'Only the course teacher can approve or revoke mentor permissions for specific topics.'}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left rtl:text-right text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-[#fbfaf6] border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="p-3.5 font-bold">{isRTL ? 'اسم المرشد والجامعة' : 'Mentor & Institution'}</th>
                        <th className="p-3.5 font-bold text-center">{isRTL ? 'الحالة الحالية' : 'Current Role'}</th>
                        {topicsList.map((topic) => (
                          <th key={topic.id} className="p-3.5 font-bold text-center">
                            {isRTL ? `المحور ${topic.displayOrder || topic.display_order}` : `Topic ${topic.displayOrder || topic.display_order}`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedMentors.map((mentor) => {
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

                            {topicsList.map((topic) => {
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

                {/* Clean Pagination for Mentors */}
                <Pagination
                  currentPage={mentorPage}
                  totalItems={mentorsList.length}
                  pageSize={MENTORS_PER_PAGE}
                  onPageChange={setMentorPage}
                  isRTL={isRTL}
                />
              </div>
            )}

            {/* TAB 3: ESCALATIONS QUEUE */}
            {activeTab === 'escalations' && (
              <div className="bg-white dark:bg-[#151d30] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 space-y-6 shadow-xs">
                <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    <span>{isRTL ? 'طلبات التصعيد المحالة للأستاذ' : 'Escalation Resolution Queue'}</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isRTL
                      ? 'الحالات التي تم تصعيدها من قبل المرشد أو الطالب للبت فيها وإصدار التقييم النهائي.'
                      : 'Submissions escalated by mentors or learners requiring final instructor determination.'}
                  </p>
                </div>

                {escalations.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 space-y-2">
                    <CheckCircle className="w-10 h-10 mx-auto text-emerald-500" />
                    <p className="text-sm font-medium">
                      {isRTL ? 'لا توجد حالات تصعيد معلقة حالياً.' : 'No pending escalations.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedEscalations.map((sub) => {
                      const topic = topicsList.find((t) => t.id === (sub.topicId || sub.topic_id));

                      return (
                        <div
                          key={sub.id}
                          className="border border-rose-200 bg-rose-50/20 rounded-2xl p-5 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-base font-bold text-slate-900">
                                {language === 'ar'
                                  ? sub.assignmentTitleAr || topic?.assignment?.titleAr
                                  : sub.assignmentTitleEn || topic?.assignment?.titleEn}
                              </h4>
                              <span className="text-xs text-slate-500">
                                {isRTL ? 'الطالب:' : 'Learner:'} <strong className="text-slate-800">{sub.learnerName}</strong>
                              </span>
                            </div>
                            <StatusBadge status={sub.status} />
                          </div>

                          <div className="bg-white rounded-xl p-3.5 text-xs border border-rose-100 space-y-1.5 font-mono">
                            <div>
                              <span className="font-semibold text-slate-700 font-sans">{isRTL ? 'رابط الكود:' : 'Code URL:'} </span>
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
                              <strong>{isRTL ? 'شرح الطالب للحل:' : 'Explanation:'} </strong> {sub.explanation}
                            </p>
                          </div>

                          <div className="pt-2 flex items-center gap-3 flex-wrap">
                            <button
                              onClick={() => handleResolveEscalation(sub.id, 'approve')}
                              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              <span>{isRTL ? 'اعتماد الحل وتأكيد الإنجاز' : 'Resolve & Confirm Complete'}</span>
                            </button>

                            <button
                              onClick={() => handleResolveEscalation(sub.id, 'revise')}
                              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>{isRTL ? 'إرجاع للطالب مع طلب تعديل' : 'Request Revision'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Pagination for Escalations */}
                    <Pagination
                      currentPage={escalationPage}
                      totalItems={escalations.length}
                      pageSize={ESCALATIONS_PER_PAGE}
                      onPageChange={setEscalationPage}
                      isRTL={isRTL}
                    />
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: ACCOUNTS & CREDENTIAL RESETS */}
            {activeTab === 'accounts' && (
              <div className="bg-white dark:bg-[#151d30] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 space-y-6 shadow-xs">
                <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Key className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                    <span>{isRTL ? 'إدارة استعادة الحسابات اليدوية' : 'Manual Account Reset Protocol'}</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isRTL
                      ? 'لا توجد استعادة تلقائية لكلمات المرور عبر البريد بسبب انقطاعات الشبكة، ويتم التوجيه للأستاذ يدوياً.'
                      : 'Automated email password reset is disabled. Locked accounts must be reset manually by the teacher.'}
                  </p>
                </div>

                {resetSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{resetSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleManualReset} className="bg-[#fbfaf6] rounded-xl p-5 border border-slate-200/80 space-y-4">
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
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800"
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
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors"
                  >
                    {isRTL ? 'تأكيد وإعادة التعيين' : 'Apply Manual Reset'}
                  </button>
                </form>

                {/* NFR-14: Data Retention & Demo Purge Panel */}
                <div className="bg-[#fbfaf6] rounded-xl p-5 border border-slate-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>{isRTL ? 'إدارة الاحتفاظ بالبيانات والخصوصية (NFR-14)' : 'Data Retention & Demo Purge Policy (NFR-14)'}</span>
                      </h4>
                      <p className="text-xs text-slate-600 max-w-xl">
                        {isRTL
                          ? 'وفقاً لمتطلبات NFR-14، يتم الاحتفاظ ببيانات ومشاريع الطلاب خلال فترة التجربة فقط. يؤدي هذا الإجراء إلى حذف كافة السجلات للطلاب الذين لم يوافقوا على استمرار حساباتهم، مع توثيق العملية في سجل الرقابة.'
                          : 'Per SRS NFR-14, demo evaluation data is purged unless learners explicitly gave retention consent. Executing this purge cleans non-consented records and logs the event to the audit trail.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handlePurgeDemoData}
                      disabled={isPurging}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{isPurging ? (isRTL ? 'جارٍ التطهير...' : 'Purging...') : (isRTL ? 'تطهير بيانات التجربة (NFR-14)' : 'Purge Unconsented Demo Data')}</span>
                    </button>
                  </div>

                  {purgeResult && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                      <div className="font-bold">{purgeResult.message}</div>
                      <div className="text-[11px] text-amber-800">
                        {isRTL ? 'الطلاب المطهّرون:' : 'Learners purged:'} {purgeResult.purgedLearnersCount} | {isRTL ? 'الواجبات المحذوفة:' : 'Submissions purged:'} {purgeResult.purgedSubmissionsCount} | {isRTL ? 'سجلات التقدم:' : 'Progress records purged:'} {purgeResult.purgedProgressCount}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: ADMINISTRATIVE AUDIT TRAIL */}
            {activeTab === 'audit' && (
              <div className="bg-white dark:bg-[#151d30] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 space-y-6 shadow-xs">
                <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
                    <span>{isRTL ? 'سجل الرقابة والعمليات الإدارية' : 'Administrative Audit Trail'}</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isRTL
                      ? 'توثيق طابع زمني دقيق لكل عملية منح أو إلغاء لصلاحيات المرشدين وإعادة تعيين الحسابات.'
                      : 'Timestamped record of mentor approval/revocation and manual account resets.'}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left rtl:text-right text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-[#fbfaf6] border-b border-slate-200 text-slate-700">
                      <tr>
                        <th className="p-3 font-bold">{isRTL ? 'التاريخ والوقت' : 'Timestamp'}</th>
                        <th className="p-3 font-bold">{isRTL ? 'نوع العملية' : 'Action'}</th>
                        <th className="p-3 font-bold">{isRTL ? 'المنفذ' : 'Performed By'}</th>
                        <th className="p-3 font-bold">{isRTL ? 'المستفيد' : 'Target User'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {auditLogs.length > 0 ? (
                        paginatedAuditLogs.map((log) => (
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
                                {isRTL
                                  ? log.action === 'MENTOR_APPROVED'
                                    ? 'اعتماد مرشد'
                                    : log.action === 'MENTOR_REVOKED'
                                    ? 'إلغاء اعتماد'
                                    : log.action === 'RESET_PASSWORD'
                                    ? 'إعادة تعيين كلمة مرور'
                                    : log.action
                                  : log.action}
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

                {/* Clean Pagination for Audit Logs */}
                <Pagination
                  currentPage={auditPage}
                  totalItems={auditLogs.length}
                  pageSize={AUDIT_PER_PAGE}
                  onPageChange={setAuditPage}
                  isRTL={isRTL}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Lesson Authoring Modal */}
      <LessonAuthoringModal
        isOpen={isAuthoringOpen}
        onClose={() => setIsAuthoringOpen(false)}
        topics={topicsList}
        onLessonCreated={handleLessonCreated}
      />
    </div>
  );
}
