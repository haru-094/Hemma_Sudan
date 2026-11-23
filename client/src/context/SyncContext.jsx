import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  saveLessonToIDB, 
  removeLessonFromIDB, 
  getAllSavedLessonsFromIDB, 
  enqueueProgressToIDB, 
  getPendingProgressFromIDB, 
  clearAllPendingQueue,
  clearAllOfflineIDB
} from '../services/indexedDB';
import { api } from '../services/api';
import { LESSONS } from '../data/mockData';
import { useAuth } from './AuthContext';

const SyncContext = createContext(null);

// Exponential retry delays: 5s, 15s, 60s
const RETRY_DELAYS = [5000, 15000, 60000];

export function SyncProvider({ children }) {
  const { currentUser, isSessionExpired, sessionExpiredWhileOffline, expireSessionNow } = useAuth();
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced' | 'pending' | 'failed'
  const [pendingQueue, setPendingQueue] = useState([]);
  const [savedLessons, setSavedLessons] = useState([]);
  const [quotaWarning, setQuotaWarning] = useState(false);
  const [storageUsagePercent, setStorageUsagePercent] = useState(12);
  const [lessonContentStatus, setLessonContentStatus] = useState({}); // { [lessonId]: 'update_available' | 'no_longer_available' }
  const [syncError, setSyncError] = useState(null); // { status, errorCode, message }
  const [requiresReauth, setRequiresReauth] = useState(false);

  const retryAttemptRef = useRef(0);
  const retryTimeoutRef = useRef(null);
  const wasReauthRequiredRef = useRef(false);

  // Monitor storage quota usage: warn when >80%
  const checkStorageQuota = useCallback(async () => {
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        if (estimate.quota && estimate.usage) {
          const percent = Math.round((estimate.usage / estimate.quota) * 100);
          setStorageUsagePercent(percent);
          if (percent >= 80) {
            setQuotaWarning(true);
            return false;
          }
        }
      } catch (e) {
        console.warn('Storage estimate failed:', e);
      }
    }
    setQuotaWarning(false);
    return true;
  }, []);

  // Synchronize queued items with server (memoised to avoid stale closures in event listeners)
  const triggerSync = useCallback(async () => {
    if (!navigator.onLine) {
      setSyncStatus('pending');
      return;
    }

    if (isSessionExpired || sessionExpiredWhileOffline) {
      console.warn('Sync paused: Session expired while offline. Queue safely preserved.');
      setSyncStatus('pending');
      setRequiresReauth(true);
      wasReauthRequiredRef.current = true;
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      return;
    }

    try {
      const itemsToSync = await getPendingProgressFromIDB();
      if (itemsToSync.length === 0) {
        setSyncStatus('synced');
        retryAttemptRef.current = 0;
        setSyncError(null);
        setRequiresReauth(false);
        return;
      }

      setSyncStatus('pending');

      // Attempt live backend synchronization with content conflict check
      const res = await api.syncProgress({
        updates: itemsToSync,
        learnerId: currentUser?.id || 'usr-learner-1',
        savedLessonIds: savedLessons,
      });

      // Update content conflict flags
      if (res && res.lessonStatus) {
        const statusMap = {};
        (res.lessonStatus.updateAvailable || []).forEach((id) => {
          statusMap[id] = 'update_available';
        });
        (res.lessonStatus.noLongerAvailable || []).forEach((id) => {
          statusMap[id] = 'no_longer_available';
        });
        setLessonContentStatus(statusMap);
      }

      // Clear from IndexedDB once confirmed
      await clearAllPendingQueue();
      setPendingQueue([]);
      setSyncStatus('synced');
      setSyncError(null);
      setRequiresReauth(false);
      retryAttemptRef.current = 0;
      await checkStorageQuota();
    } catch (err) {
      console.warn('Sync attempt failed:', err.message);

      // Error Classification:
      if (err.status === 401) {
        // Alternative 3: 401 session expired
        // Do NOT retry automatically. Keep queue as 'pending' and ask learner to log in again.
        console.warn('Sync paused: 401 Unauthorized (session expired). Queue preserved.');
        setSyncStatus('pending');
        setRequiresReauth(true);
        setSyncError({
          status: 401,
          errorCode: 'SESSION_EXPIRED',
          message: 'Your session expired while offline. Progress is safely preserved in queue. Please log in again to sync.',
        });
        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      } else if (err.status === 400 || err.status === 403) {
        // Alternative 4: 400 or 403 rejected
        // Mark as 'failed' with error code and no automatic retry.
        console.warn(`Sync rejected: HTTP ${err.status} with error code ${err.errorCode || 'REJECTED'}. No automatic retry.`);
        setSyncStatus('failed');
        setSyncError({
          status: err.status,
          errorCode: err.errorCode || 'CLIENT_REJECTED',
          message: err.message || `Request rejected with status ${err.status}`,
        });
        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      } else {
        // Alternative 2: Timeout, 5xx server error, or network error
        // Stays 'pending' and is retried automatically with increasing delays (5s, 15s, 60s)
        setSyncError(null);
        const currentAttempt = retryAttemptRef.current;
        if (currentAttempt < RETRY_DELAYS.length) {
          const delay = RETRY_DELAYS[currentAttempt];
          retryAttemptRef.current += 1;
          setSyncStatus('pending');

          if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = setTimeout(() => {
            triggerSync();
          }, delay);
        } else {
          // After 3 failed attempts, mark as failed and permit manual retry
          setSyncStatus('failed');
        }
      }
    }
  }, [checkStorageQuota, currentUser?.id, isSessionExpired, savedLessons, sessionExpiredWhileOffline]);

  // Beforeunload safety guard to warn user before discarding unsynced progress
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (pendingQueue.length > 0 || syncStatus === 'pending') {
        e.preventDefault();
        e.returnValue = 'You have unsynchronized learning progress updates. Leaving may cause unsynced progress to be delayed or lost.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pendingQueue.length, syncStatus]);

  // Initialize data from IndexedDB
  useEffect(() => {
    async function loadFromDB() {
      try {
        const lessons = await getAllSavedLessonsFromIDB();
        if (lessons.length > 0) {
          setSavedLessons(lessons.map((l) => l.id));
        } else {
          const defaultLesson = LESSONS[0];
          if (defaultLesson) {
            await saveLessonToIDB(defaultLesson);
            setSavedLessons([defaultLesson.id]);
          }
        }

        const queue = await getPendingProgressFromIDB();
        setPendingQueue(queue);
        if (queue.length > 0) {
          setSyncStatus('pending');
        }
      } catch (err) {
        console.error('Error initializing IndexedDB:', err);
      }
    }

    loadFromDB();
    checkStorageQuota();
  }, [checkStorageQuota]);

  // Online / offline event listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      retryAttemptRef.current = 0;
      triggerSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [triggerSync]);

  // Handle session expiration and auto-resume after re-authentication
  useEffect(() => {
    if (isSessionExpired || sessionExpiredWhileOffline) {
      setRequiresReauth(true);
      wasReauthRequiredRef.current = true;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    } else if (currentUser && !isSessionExpired && wasReauthRequiredRef.current) {
      // Re-authenticated: automatically resume sync without data loss
      wasReauthRequiredRef.current = false;
      setRequiresReauth(false);
      setSyncError(null);
      if (navigator.onLine) {
        triggerSync();
      }
    }
  }, [currentUser, isSessionExpired, sessionExpiredWhileOffline, triggerSync]);

  // Record progress with client UUID for duplicate protection
  const recordProgress = async (lessonId, lastPosition = 100, status = 'completed') => {
    const updateId = `upd-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const progressUpdate = {
      updateId,
      lessonId,
      lastPosition,
      status,
      clientTime: new Date().toISOString(),
      retryCount: 0,
    };

    try {
      await enqueueProgressToIDB(progressUpdate);
      setPendingQueue((prev) => [...prev, progressUpdate]);
      setSyncStatus('pending');

      if (navigator.onLine) {
        triggerSync();
      }
    } catch (err) {
      console.error('Failed to record progress to IndexedDB:', err);
    }
  };

  // Refresh updated lesson from server
  const refreshSavedLesson = async (lessonId) => {
    try {
      const data = await api.getLesson(lessonId);
      if (data && data.lesson) {
        await saveLessonToIDB(data.lesson);
      } else {
        const mock = LESSONS.find((l) => l.id === lessonId);
        if (mock) await saveLessonToIDB(mock);
      }
    } catch {
      const mock = LESSONS.find((l) => l.id === lessonId);
      if (mock) await saveLessonToIDB(mock);
    }
    setLessonContentStatus((prev) => {
      const next = { ...prev };
      delete next[lessonId];
      return next;
    });
  };

  // Manual retry resets the attempt counter
  const manualRetrySync = () => {
    retryAttemptRef.current = 0;
    triggerSync();
  };

  const toggleSaveOffline = async (lessonId) => {
    const isSaved = savedLessons.includes(lessonId);

    if (!isSaved) {
      const canSave = await checkStorageQuota();
      if (!canSave) {
        alert('Warning: Local storage exceeds 80% quota limit. Please free up space before saving new lessons.');
        return;
      }

      const lessonToSave = LESSONS.find((l) => l.id === lessonId);
      if (lessonToSave) {
        await saveLessonToIDB(lessonToSave);
        setSavedLessons((prev) => [...prev, lessonId]);
      }
    } else {
      await removeLessonFromIDB(lessonId);
      setSavedLessons((prev) => prev.filter((id) => id !== lessonId));
      setLessonContentStatus((prev) => {
        const next = { ...prev };
        delete next[lessonId];
        return next;
      });
    }

    await checkStorageQuota();
  };

  // Before discarding offline storage, warn if unsynced progress exists
  const clearCache = async () => {
    if (pendingQueue.length > 0) {
      const confirmed = window.confirm(
        'Warning: You have unsynchronized progress items pending in offline queue. Discarding offline cache now will remove them permanently. Do you wish to cancel or continue?'
      );
      if (!confirmed) return false;
    }
    await clearAllOfflineIDB();
    setSavedLessons([]);
    setPendingQueue([]);
    setSyncStatus('synced');
    setLessonContentStatus({});
    setSyncError(null);
    setRequiresReauth(false);
    await checkStorageQuota();
    return true;
  };

  const isLessonSaved = (lessonId) => savedLessons.includes(lessonId);

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        syncStatus,
        setSyncStatus,
        pendingQueue,
        savedLessons,
        quotaWarning,
        storageUsagePercent,
        lessonContentStatus,
        syncError,
        requiresReauth: requiresReauth || isSessionExpired || sessionExpiredWhileOffline,
        expireSessionNow,
        refreshSavedLesson,
        recordProgress,
        triggerSync,
        manualRetrySync,
        toggleSaveOffline,
        isLessonSaved,
        clearCache,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}
