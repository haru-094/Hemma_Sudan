import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useSync } from '../../context/SyncContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Menu, 
  X,
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar() {
  const { language, toggleLanguage, isRTL } = useLanguage();
  const { currentUser, logout, isTeacher, isMentor } = useAuth();
  const { isOnline, triggerSync, queueCount } = useSync();
  const { toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#151d30]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Brand: Logo + Brand Title */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/hemma-logo-v2-192.png"
                alt="Hemma Sudan Logo"
                className="w-9 h-9 object-contain rounded-xl shadow-xs"
              />
              <div className="leading-tight">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block tracking-tight">
                  Hemma Sudan
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Programming Learning & Mentorship
                </span>
              </div>
            </Link>

            {/* Navigation Pills: Lessons & Dashboard */}
            <nav className="hidden md:flex items-center gap-1.5 ml-2 rtl:mr-2 rtl:ml-0">
              <Link
                to="/lessons"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive('/lessons')
                    ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {isRTL ? 'الدروس والمسارات' : 'Lessons'}
              </Link>

              <Link
                to="/dashboard"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive('/dashboard')
                    ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {isRTL ? 'لوحة المتابعة' : 'Dashboard'}
              </Link>

              {(isMentor || isTeacher) && (
                <Link
                  to="/reviews"
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive('/reviews')
                      ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {isRTL ? 'مراجعات المرشدين' : 'Reviews'}
                </Link>
              )}

              {isTeacher && (
                <Link
                  to="/teacher"
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive('/teacher')
                      ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {isRTL ? 'إدارة الأستاذ' : 'Teacher Admin'}
                </Link>
              )}

              <Link
                to="/help"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive('/help')
                    ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {isRTL ? 'المساعدة' : 'Help'}
              </Link>
            </nav>
          </div>

          {/* Right Action Utilities (Status, Sync, Language, Log Out) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Online Status Pill */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                isOnline
                  ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-2xs'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-amber-500'
                }`}
              ></span>
              <span className="text-[11px] font-medium">
                {isOnline ? (isRTL ? 'متصل' : 'Online') : (isRTL ? 'غير متصل' : 'Offline')}
              </span>
            </div>

            {/* Sync Status Badge */}
            <button
              type="button"
              onClick={triggerSync}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#e6f4ea] dark:bg-emerald-950/60 text-[#0f5132] dark:text-emerald-300 border border-[#d1e7dd] dark:border-emerald-800/60 hover:bg-[#d8efe0] dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
              title={isRTL ? 'انقر لتحديث المزامنة يدوياً' : 'Click to sync now'}
            >
              <span>
                {queueCount > 0
                  ? isRTL
                    ? `${queueCount} تحديث بانتظار المزامنة`
                    : `${queueCount} updates to sync`
                  : isRTL
                  ? 'تمت مزامنة كافة البيانات'
                  : 'All progress synced'}
              </span>
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? (isRTL ? 'الوضع المضيء' : 'Light Mode') : (isRTL ? 'الوضع الداكن' : 'Dark Mode')}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline text-[11px] font-semibold">{isRTL ? 'مضيء' : 'Light'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline text-[11px] font-semibold">{isRTL ? 'داكن' : 'Dark'}</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              aria-label="Toggle language"
            >
              {language === 'ar' ? 'English' : 'العربية'}
            </button>

            {/* Auth Action */}
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                {isRTL ? 'خروج' : 'Log out'}
              </button>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1 rounded-lg text-xs font-medium bg-[#0f5132] hover:bg-[#0b3b24] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white transition-colors"
              >
                {isRTL ? 'دخول' : 'Sign in'}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151d30] px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <Link
            to="/lessons"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
              isActive('/lessons') ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {isRTL ? 'الدروس والمسارات' : 'Lessons & Tracks'}
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
              isActive('/dashboard') ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {isRTL ? 'لوحة المتابعة' : 'Dashboard'}
          </Link>
          {(isMentor || isTeacher) && (
            <Link
              to="/reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {isRTL ? 'مراجعات المرشدين' : 'Reviews'}
            </Link>
          )}
          {isTeacher && (
            <Link
              to="/teacher"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {isRTL ? 'إدارة الأستاذ' : 'Teacher Admin'}
            </Link>
          )}
          <Link
            to="/help"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {isRTL ? 'المساعدة والدليل' : 'Help & Documentation'}
          </Link>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isRTL ? 'مظهر الموقع' : 'Appearance'}
            </span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isRTL ? 'الوضع المضيء' : 'Light Mode'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isRTL ? 'الوضع الداكن' : 'Dark Mode'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
