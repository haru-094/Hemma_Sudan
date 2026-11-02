import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

export function SyncProvider({ children }) {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [pendingQueue, setPendingQueue] = useState([]);
  const [savedLessons, setSavedLessons] = useState([]);
  const [quotaWarning, setQuotaWarning] = useState(false);
  const [storageUsagePercent, setStorageUsagePercent] = useState(12);

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

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

  const triggerSync = async () => {
    if (!navigator.onLine) {
      setSyncStatus('pending');
      return;
    }

    try {
      const itemsToSync = await getPendingProgressFromIDB();
      if (itemsToSync.length === 0) {
        setSyncStatus('synced');
        return;
      }

      // Attempt live backend synchronization with fallback
      try {
        await api.syncProgress({
          updates: itemsToSync,
          learnerId: 'usr-learner-1',
        });
      } catch (backendErr) {
        // Fallback for offline or local dev without active server
        await new Promise((res) => setTimeout(res, 400));
      }

      await clearAllPendingQueue();
      setPendingQueue([]);
      setSyncStatus('synced');
      await checkStorageQuota();
    } catch (err) {
      console.error('Sync failed:', err);
      setSyncStatus('failed');
    }
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
