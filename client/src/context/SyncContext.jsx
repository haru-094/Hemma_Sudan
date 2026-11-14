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

const SyncContext = createContext(null);

// Exponential retry delays: 5s, 15s, 60s
const RETRY_DELAYS = [5000, 15000, 60000];

export function SyncProvider({ children }) {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced' | 'pending' | 'failed'
  const [pendingQueue, setPendingQueue] = useState([]);
  const [savedLessons, setSavedLessons] = useState([]);
  const [quotaWarning, setQuotaWarning] = useState(false);
  const [storageUsagePercent, setStorageUsagePercent] = useState(12);

  const retryAttemptRef = useRef(0);
  const retryTimeoutRef = useRef(null);

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
  }, []);

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

  // Synchronize queued items with server
  const triggerSync = async () => {
    if (!navigator.onLine) {
      setSyncStatus('pending');
      return;
    }

    try {
      const itemsToSync = await getPendingProgressFromIDB();
      if (itemsToSync.length === 0) {
        setSyncStatus('synced');
        retryAttemptRef.current = 0;
        return;
      }

      setSyncStatus('pending');

      // Attempt live backend synchronization
      await api.syncProgress({
        updates: itemsToSync,
        learnerId: 'usr-learner-1',
      });

      // Clear from IndexedDB once confirmed
      await clearAllPendingQueue();
      setPendingQueue([]);
      setSyncStatus('synced');
      retryAttemptRef.current = 0;
      await checkStorageQuota();
    } catch (err) {
      console.warn('Sync attempt failed:', err.message);

      // Exponential backoff retry logic (5s, 15s, 60s)
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
    }

    await checkStorageQuota();
  };

  const clearCache = async () => {
    await clearAllOfflineIDB();
    setSavedLessons([]);
    setPendingQueue([]);
    setSyncStatus('synced');
    await checkStorageQuota();
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
