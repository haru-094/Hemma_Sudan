import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { SyncProvider } from './context/SyncContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import OfflineBanner from './components/layout/OfflineBanner';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LessonsPage from './pages/LessonsPage';
import LessonDetailPage from './pages/LessonDetailPage';
import TopicProjectPage from './pages/TopicProjectPage';
import LearnerDashboard from './pages/LearnerDashboard';
import ReviewsDashboard from './pages/ReviewsDashboard';
import TeacherAdminPage from './pages/TeacherAdminPage';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SyncProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
              <Navbar />
              <OfflineBanner />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/lessons" element={<LessonsPage />} />
                  <Route path="/lessons/:id" element={<LessonDetailPage />} />
                  <Route path="/project/:topicId" element={<TopicProjectPage />} />
                  <Route path="/submit/:topicId" element={<TopicProjectPage />} />
                  <Route path="/dashboard" element={<LearnerDashboard />} />
                  <Route path="/reviews" element={<ReviewsDashboard />} />
                  <Route path="/teacher" element={<TeacherAdminPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </SyncProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
