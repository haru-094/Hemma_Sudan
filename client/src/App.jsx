import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { SyncProvider } from './context/SyncContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import OfflineBanner from './components/layout/OfflineBanner';
import UnsupportedBrowser from './components/common/UnsupportedBrowser';
import ConsentModal from './components/common/ConsentModal';
import ErrorBoundary from './components/common/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LessonsPage from './pages/LessonsPage';
import LessonDetailPage from './pages/LessonDetailPage';
import TopicProjectPage from './pages/TopicProjectPage';
import LearnerDashboard from './pages/LearnerDashboard';
import ReviewsDashboard from './pages/ReviewsDashboard';
import TeacherAdminPage from './pages/TeacherAdminPage';
import HelpPage from './pages/HelpPage';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <SyncProvider>
              <BrowserRouter>
                <div className="min-h-screen flex flex-col bg-[#fbfaf6] text-slate-900 selection:bg-[#0f5132] selection:text-white transition-colors duration-200">
                  <UnsupportedBrowser />
                  <Navbar />
                  <OfflineBanner />
                  <ConsentModal />
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
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </BrowserRouter>
            </SyncProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
