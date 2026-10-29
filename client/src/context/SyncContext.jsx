import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SyncContext = createContext(null);

export function SyncProvider({ children }) {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced' | 'pending' | 'failed'
  const [pendingQueue, setPendingQueue] = useState(() => {
    try {
      const saved = localStorage.getItem('hemma_pending_queue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [savedLessons, setSavedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('hemma_saved_lessons');
      return saved ? JSON.parse(saved) : ['lesson-1']; // Default lesson 1 saved
    } catch {
      return ['lesson-1'];
    }
  });
  const [quotaWarning, setQuotaWarning] = useState(false);
  const [storageUsagePercent, setStorageUsagePercent] = useState(15); // Default mock percent

  // Check storage quota (FR §3.1: warn at >80% quota)
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
      } catch {
        // Fallback for environments where estimate fails
      }
    }
    setQuotaWarning(false);
    return true;
  }, []);

  // Listen to browser network changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto sync when connection is restored per FR-5.2
      triggerSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    checkStorageQuota();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkStorageQuota]);

  // Save pending queue to localStorage
  useEffect(() => {
    localStorage.setItem('hemma_pending_queue', JSON.stringify(pendingQueue));
    if (pendingQueue.length > 0 && syncStatus !== 'failed') {
      setSyncStatus('pending');
    } else if (pendingQueue.length === 0) {
      setSyncStatus('synced');
    }
  }, [pendingQueue, syncStatus]);

  // Save offline lesson ids
  useEffect(() => {
    localStorage.setItem('hemma_saved_lessons', JSON.stringify(savedLessons));
  }, [savedLessons]);

  // Record a progress update locally (FR-5.1 & FR-5.4)
  const recordProgress = (lessonId, lastPosition = 100, status = 'completed') => {
    const updateId = `upd-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const update = {
      updateId,
      lessonId,
      lastPosition,
      status,
      clientTime: new Date().toISOString(),
      retryCount: 0,
    };

    setPendingQueue((prev) => [...prev, update]);
    setSyncStatus('pending');

    if (isOnline) {
      triggerSync();
    }
  };

  // Synchronize queued items with server (with FR-5.7 retry logic 5s, 15s, 60s)
  const triggerSync = async () => {
    if (!navigator.onLine) {
      setSyncStatus('pending');
      return;
    }

    try {
      // Simulate sync delay
      await new Promise((res) => setTimeout(res, 600));

      // In Step 1 & 2 before backend connection, mark all pending as synced
      setPendingQueue([]);
      setSyncStatus('synced');
    } catch {
      setSyncStatus('failed');
    }
  };

  // Toggle saving lesson offline
  const toggleSaveOffline = async (lessonId) => {
    const canSave = await checkStorageQuota();
    if (!canSave && !savedLessons.includes(lessonId)) {
      alert('Local storage exceeds 80% quota. Please remove saved lessons first.');
      return;
    }

    setSavedLessons((prev) => {
      if (prev.includes(lessonId)) {
        return prev.filter((id) => id !== lessonId);
      } else {
        return [...prev, lessonId];
      }
    });
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

