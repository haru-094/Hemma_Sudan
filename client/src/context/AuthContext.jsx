import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const DEMO_USERS = [
  {
    id: 'usr-teacher-1',
    name: 'Dr. Tariq Ahmed',
    email: 'teacher@hemma.sd',
    role: 'teacher',
    courseTitle: 'Introduction to Computer Science & Python',
    language: 'en',
  },
  {
    id: 'usr-mentor-1',
    name: 'Sarah Ibrahim',
    email: 'sarah.mentor@hemma.sd',
    role: 'mentor',
    university: 'University of Khartoum',
    approvedTopics: ['topic-1', 'topic-2'],
    language: 'en',
  },
  {
    id: 'usr-mentor-2',
    name: 'Omar Farouk',
    email: 'omar.mentor@hemma.sd',
    role: 'mentor',
    university: 'Sudan University of Science and Technology',
    approvedTopics: ['topic-2', 'topic-3'],
    language: 'ar',
  },
  {
    id: 'usr-mentor-3',
    name: 'Mona Elhassan',
    email: 'mona.mentor@hemma.sd',
    role: 'mentor',
    university: 'Al-Neelain University',
    approvedTopics: ['topic-1'],
    language: 'en',
  },
  {
    id: 'usr-learner-1',
    name: 'Ahmed Osman',
    email: 'ahmed.student@hemma.sd',
    role: 'learner',
    university: 'University of Khartoum',
    ageConfirmed: true,
    language: 'en',
  },
];

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24-hour session window

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usersList, setUsersList] = useState(() => {
    try {
      const saved = localStorage.getItem('hemma_registered_users');
      return saved ? JSON.parse(saved) : DEMO_USERS;
    } catch {
      return DEMO_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hemma_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USERS[4];
      }
    }
    return DEMO_USERS[4];
  });

  // FR-12.1: Session Expiry Tracking
  const [expiresAt, setExpiresAt] = useState(() => {
    const saved = localStorage.getItem('hemma_session_expires_at');
    if (saved) {
      const parsed = parseInt(saved, 10);
      return !isNaN(parsed) ? parsed : Date.now() + SESSION_DURATION_MS;
    }
    return Date.now() + SESSION_DURATION_MS;
  });

  const [isSessionExpired, setIsSessionExpired] = useState(() => {
    const saved = localStorage.getItem('hemma_session_expires_at');
    if (saved) {
      const parsed = parseInt(saved, 10);
      return !isNaN(parsed) && Date.now() > parsed;
    }
    return false;
  });

  const [sessionExpiredWhileOffline, setSessionExpiredWhileOffline] = useState(() => {
    const saved = localStorage.getItem('hemma_session_expired_offline');
    return saved === 'true';
  });

  // NFR-14: Data Retention & Consent Tracking
  const [loginCount, setLoginCount] = useState(() => {
    const saved = currentUser ? localStorage.getItem(`hemma_login_count_${currentUser.id}`) : null;
    return saved ? parseInt(saved, 10) : 1;
  });

  const [consentStatus, setConsentStatus] = useState(() => {
    return currentUser ? (localStorage.getItem(`hemma_consent_${currentUser.id}`) || 'pending') : 'pending';
  });

  const [showConsentModal, setShowConsentModal] = useState(false);

  // Keep registered users in localStorage
  useEffect(() => {
    localStorage.setItem('hemma_registered_users', JSON.stringify(usersList));
  }, [usersList]);

  // Keep current user and expiration in sync with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hemma_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hemma_user');
      localStorage.removeItem('hemma_session_expires_at');
      localStorage.removeItem('hemma_session_expired_offline');
      setIsSessionExpired(false);
      setSessionExpiredWhileOffline(false);
    }
  }, [currentUser]);

  // Persist session expiry flags
  useEffect(() => {
    if (expiresAt) {
      localStorage.setItem('hemma_session_expires_at', expiresAt.toString());
    }
  }, [expiresAt]);

  useEffect(() => {
    if (sessionExpiredWhileOffline) {
      localStorage.setItem('hemma_session_expired_offline', 'true');
    } else {
      localStorage.removeItem('hemma_session_expired_offline');
    }
  }, [sessionExpiredWhileOffline]);

  // Periodic and event-driven session expiration check (FR-12.1)
  const checkSessionExpiration = useCallback(() => {
    if (!currentUser || !expiresAt) return;
    const now = Date.now();
    if (now > expiresAt) {
      setIsSessionExpired(true);
      if (!navigator.onLine) {
        setSessionExpiredWhileOffline(true);
      }
    }
  }, [currentUser, expiresAt]);

  useEffect(() => {
    checkSessionExpiration();
    const interval = setInterval(checkSessionExpiration, 15000); // Check every 15s

    const handleOnlineStatusChange = () => {
      checkSessionExpiration();
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, [checkSessionExpiration]);

  const resetSessionExpiry = () => {
    const newExpiresAt = Date.now() + SESSION_DURATION_MS;
    setExpiresAt(newExpiresAt);
    setIsSessionExpired(false);
    setSessionExpiredWhileOffline(false);
    localStorage.setItem('hemma_session_expires_at', newExpiresAt.toString());
    localStorage.removeItem('hemma_session_expired_offline');
  };

  const handleUserSessionInit = (user) => {
    if (!user) return;
    const key = `hemma_login_count_${user.id}`;
    const prevCount = parseInt(localStorage.getItem(key) || '0', 10);
    const newCount = prevCount + 1;
    localStorage.setItem(key, newCount.toString());
    setLoginCount(newCount);

    const savedConsent = localStorage.getItem(`hemma_consent_${user.id}`) || 'pending';
    setConsentStatus(savedConsent);

    // NFR-14: Prompt consent modal on second login for learners if not yet decided
    if (newCount >= 2 && savedConsent === 'pending' && user.role === 'learner') {
      setShowConsentModal(true);
    }
  };

  const login = (email, password) => {
    const found = usersList.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      throw new Error('Account not found with this email address.');
    }
    setCurrentUser(found);
    resetSessionExpiry();
    handleUserSessionInit(found);
    return found;
  };

  const loginAs = (userId) => {
    const found = usersList.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      resetSessionExpiry();
      handleUserSessionInit(found);
    }
  };

  const registerLearner = ({ name, email, university, ageConfirmed }) => {
    if (!ageConfirmed) {
      throw new Error('You must confirm that you are 18 years of age or older.');
    }
    const existing = usersList.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      throw new Error('An account is already registered with this email address.');
    }

    const newLearner = {
      id: `usr-learner-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'learner',
      university: university.trim(),
      ageConfirmed: true,
      language: 'en',
    };

    setUsersList((prev) => [...prev, newLearner]);
    setCurrentUser(newLearner);
    resetSessionExpiry();
    handleUserSessionInit(newLearner);
    return newLearner;
  };

  // NFR-14: Update Data Retention Consent
  const updateConsent = async (consentGiven) => {
    if (!currentUser) return;
    const status = consentGiven ? 'granted' : 'declined';
    localStorage.setItem(`hemma_consent_${currentUser.id}`, status);
    setConsentStatus(status);
    setShowConsentModal(false);

    try {
      await api.updateConsent({
        userId: currentUser.id,
        consent: consentGiven,
      });
    } catch (err) {
      console.warn('Backend consent sync warning (offline or fallback mode):', err.message);
    }
  };

  const triggerConsentModalNow = () => {
    setShowConsentModal(true);
  };

  // Test / Demo helper to trigger session expiration immediately
  const expireSessionNow = (mockOffline = false) => {
    const pastTime = Date.now() - 5000;
    setExpiresAt(pastTime);
    setIsSessionExpired(true);
    if (mockOffline || !navigator.onLine) {
      setSessionExpiredWhileOffline(true);
    }
    localStorage.setItem('hemma_session_expires_at', pastTime.toString());
  };

  const logout = () => {
    setCurrentUser(null);
    setExpiresAt(null);
    setIsSessionExpired(false);
    setSessionExpiredWhileOffline(false);
    localStorage.removeItem('hemma_user');
    localStorage.removeItem('hemma_session_expires_at');
    localStorage.removeItem('hemma_session_expired_offline');
  };

  const isTeacher = currentUser?.role === 'teacher';
  const isMentor = currentUser?.role === 'mentor';
  const isLearner = currentUser?.role === 'learner' || currentUser?.role === 'mentor';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        usersList,
        login,
        loginAs,
        registerLearner,
        logout,
        isTeacher,
        isMentor,
        isLearner,
        // FR-12.1 session expiry state & controls
        expiresAt,
        isSessionExpired,
        sessionExpiredWhileOffline,
        setSessionExpiredWhileOffline,
        expireSessionNow,
        resetSessionExpiry,
        // NFR-14 Data Retention & Privacy
        loginCount,
        consentStatus,
        showConsentModal,
        setShowConsentModal,
        updateConsent,
        triggerConsentModalNow,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
