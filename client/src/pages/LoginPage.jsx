import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { 
  LogIn, 
  Mail, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  KeyRound, 
  HelpCircle,
  X,
  ArrowRight,
  ArrowLeft,
  BookOpen
} from 'lucide-react';

export default function LoginPage() {
  const { t, isRTL, language } = useLanguage();
  const { login, loginAs, currentUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid login credentials');
    }
  };

  const handleDemoSelect = (user) => {
    loginAs(user.id);
    navigate(user.role === 'teacher' ? '/teacher' : user.role === 'mentor' ? '/reviews' : '/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-500 mx-auto flex items-center justify-center text-white shadow-md">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isRTL ? 'تسجيل الدخول إلى همة السودان' : 'Sign in to Hemma Sudan'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {isRTL
            ? 'منصة تعلم البرمجة التكميلية والمصممة للعمل في ظل انقطاع الإنترنت'
            : 'Supplementary programming & mentorship platform built for offline resilience'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-200 rounded-3xl space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                {isRTL ? 'البريد الإلكتروني الجامعي' : 'University / Student Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu.sd"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs sm:text-sm font-sans ltr-forced"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-900">
                  {isRTL ? 'كلمة المرور' : 'Password'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-semibold text-emerald-700 hover:underline"
                >
                  {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs sm:text-sm font-sans ltr-forced"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{isRTL ? 'تسجيل الدخول' : 'Sign In'}</span>
            </button>
          </form>

          {/* Quick Demo Selector for fast evaluation */}
          <div className="pt-2 border-t border-slate-100">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
              {isRTL ? 'تسجيل سريع بحسابات التجربة' : 'One-Click Demo Accounts'}
            </span>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleDemoSelect(u)}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left rtl:text-right flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <span className="font-semibold truncate">
                    {u.name}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                    u.role === 'teacher' ? 'bg-purple-100 text-purple-800' : u.role === 'mentor' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {u.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-slate-600">
            <span>{isRTL ? 'ليس لديك حساب طالب؟ ' : "Don't have a learner account? "}</span>
            <Link to="/register" className="font-bold text-emerald-700 hover:underline">
              {isRTL ? 'إنشاء حساب جديد' : 'Register as a Learner'}
            </Link>
          </div>
        </div>
      </div>

      {/* Manual Password Reset Notice Modal (SRS FR-13.1) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">
                {isRTL ? 'إجراءات استعادة الحساب وكلمة المرور' : 'Manual Account Reset Notice'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isRTL
                  ? 'وفقاً لمتطلبات المنصة (FR-13.1)، لا تتوفر خاصية الاستعادة التلقائية عبر البريد الإلكتروني. يرجى التواصل مباشرة مع أستاذ المقرر لإعادة تعيين بيانات الدخول يدوياً.'
                  : 'Per SRS FR-13.1, automated password recovery via email is disabled. If you are locked out or lost access, please contact the Course Lead (Teacher) directly for a manual reset.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <strong>{isRTL ? 'البريد الرسمي لأستاذ المادة:' : 'Course Lead Contact:'}</strong>
              <div className="font-mono text-emerald-800 font-semibold ltr-forced">
                teacher@hemma.sd (Dr. Tariq Ahmed)
              </div>
            </div>

            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              {isRTL ? 'فهمت ذلك' : 'Understood'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

