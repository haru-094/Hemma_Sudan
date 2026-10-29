import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { useSync } from '../../context/SyncContext';
import { 
  Wifi, 
  WifiOff, 
  Globe, 
  BookOpen, 
  LayoutDashboard, 
  CheckSquare, 
  ShieldCheck, 
  User, 
  Menu, 
  X,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

export default function Navbar() {
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const { currentUser, loginAs, logout, isTeacher, isMentor } = useAuth();
  const { isOnline, syncStatus, triggerSync, quotaWarning } = useSync();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Simulation Role Switcher Bar for Demo Testing (SRS §2.3) */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[10px]">
            Demo Environment:
          </span>
          <span>Logged in as:</span>
          <span className="text-white font-medium">
            {currentUser ? currentUser.name : 'Guest'} ({currentUser ? currentUser.role : 'None'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Switch Role:</span>
          <div className="flex items-center gap-1">
            {DEMO_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => loginAs(user.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  currentUser?.id === user.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {user.role === 'teacher' ? 'Teacher' : user.role === 'mentor' ? user.name.split(' ')[0] + ' (Mentor)' : 'Learner'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                {t.appName}
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:block">
                {t.appTagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/lessons"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/lessons')
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {t.nav.lessons}
            </Link>

            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/dashboard')
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              {t.nav.dashboard}
            </Link>

            {(isMentor || isTeacher) && (
              <Link
                to="/reviews"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/reviews')
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                {t.nav.reviews}
              </Link>
            )}

            {isTeacher && (
              <Link
                to="/teacher"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/teacher')
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                {t.nav.teacherAdmin}
              </Link>
            )}
          </nav>

          {/* Right Action Utilities (Language, Sync, Connection Status) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Online / Offline Status Badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title={isOnline ? t.sync.online : t.sync.offline}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span className="hidden sm:inline">{t.sync.online}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.sync.offline}</span>
                </>
              )}
            </div>

            {/* Sync Status Button */}
            <button
              onClick={triggerSync}
              className={`p-1.5 rounded-lg border transition-colors flex items-center text-xs gap-1 ${
                syncStatus === 'synced'
                  ? 'text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                  : syncStatus === 'pending'
                  ? 'text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100'
                  : 'text-rose-700 border-rose-200 bg-rose-50 hover:bg-rose-100'
              }`}
              title={
                syncStatus === 'synced'
                  ? t.sync.synced
                  : syncStatus === 'pending'
                  ? t.sync.pending
                  : t.sync.failed
              }
            >
              <RefreshCw
                className={`w-4 h-4 ${syncStatus === 'pending' ? 'animate-spin text-amber-600' : ''}`}
              />
              <span className="hidden lg:inline">
                {syncStatus === 'synced'
                  ? t.sync.synced
                  : syncStatus === 'pending'
                  ? t.sync.pending
                  : t.sync.failed}
              </span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              title="Switch language / تغيير اللغة"
            >
              <Globe className="w-4 h-4 text-emerald-700" />
              <span>{t.common.languageSwitch}</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg">
          <Link
            to="/lessons"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            {t.nav.lessons}
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            {t.nav.dashboard}
          </Link>
          {(isMentor || isTeacher) && (
            <Link
              to="/reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              {t.nav.reviews}
            </Link>
          )}
          {isTeacher && (
            <Link
              to="/teacher"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              {t.nav.teacherAdmin}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

