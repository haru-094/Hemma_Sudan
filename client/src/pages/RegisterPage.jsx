import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  GraduationCap, 
  CheckSquare, 
  Square, 
  AlertCircle, 
  ShieldCheck,
  BookOpen,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export default function RegisterPage() {
  const { t, isRTL, language } = useLanguage();
  const { registerLearner } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [password, setPassword] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!ageConfirmed) {
      setErrorMsg(
        isRTL
          ? 'يجب تأكيد أن عمرك 18 عاماً فما فوق للتسجيل (القاعدة BR-1).'
          : 'You must confirm that you are aged 18 or above (BR-1 policy).'
      );
      return;
    }

    try {
      registerLearner({
        name,
        email,
        university,
        ageConfirmed,
      });
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-500 mx-auto flex items-center justify-center text-white shadow-md">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isRTL ? 'إنشاء حساب طالب جديد' : 'Learner Registration'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {isRTL
            ? 'انضم إلى منصة همة السودان التكميلية لدراسة مقررات البرمجة'
            : 'Join the Hemma Sudan supplementary programming pilot'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-200 rounded-3xl space-y-6">
          {/* Role Specification Callout (SRS FR-1.1 & §1.4) */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">
                {isRTL ? 'تسجيل الطلاب فقط' : 'Learner Self-Registration'}
              </strong>
              <span>
                {isRTL
                  ? 'وفقاً لـ (FR-1.1)، التسجيل الذاتي متاح فقط لدور الطالب. يتم منح صفة المرشد أو الأستاذ حصرياً عبر إدارة المقرر.'
                  : 'Per SRS FR-1.1, self-registration only grants the Learner role. Teacher & Mentor roles are granted by course administration.'}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                {isRTL ? 'الاسم الكامل' : 'Full Name'}
                <span className="text-rose-500 mx-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isRTL ? 'مثال: محمد أحمد علي' : 'e.g. Ahmed Osman'}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs sm:text-sm font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
                <span className="text-rose-500 mx-1">*</span>
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
                  placeholder="student@uofk.edu.sd"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs sm:text-sm font-sans ltr-forced"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                {isRTL ? 'الجامعة أو الكلية (في السودان)' : 'University / College'}
                <span className="text-rose-500 mx-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder={isRTL ? 'جامعة الخرطوم، جامعة السودان...' : 'University of Khartoum, SUST...'}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs sm:text-sm font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                {isRTL ? 'كلمة المرور' : 'Password'}
                <span className="text-rose-500 mx-1">*</span>
              </label>
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

            {/* Age Confirmation Checkbox (SRS BR-1) */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="leading-snug">
                  {isRTL ? (
                    <>
                      أؤكد أنني <strong>طالب جامعي وعمري 18 عاماً فما فوق</strong>، ومؤهل لاستخدام منصة همة السودان وفقاً للشروط (BR-1).
                    </>
                  ) : (
                    <>
                      I confirm that I am a <strong>university student aged 18 or above</strong> in Sudan, eligible to participate in this pilot (BR-1).
                    </>
                  )}
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isRTL ? 'إتمام إنشاء الحساب' : 'Create Learner Account'}</span>
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-600 border-t border-slate-100">
            <span>{isRTL ? 'لديك حساب مسجل بالفعل؟ ' : 'Already have an account? '}</span>
            <Link to="/login" className="font-bold text-emerald-700 hover:underline">
              {isRTL ? 'تسجيل الدخول' : 'Sign In'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

