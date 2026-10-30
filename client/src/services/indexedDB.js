// IndexedDB Storage Service for Hemma Sudan (SRS §2.4, FR-4.1, FR-5.1, FR-5.4)
const DB_NAME = 'hemma_sudan_db';
const DB_VERSION = 1;

export const STORES = {
  LESSONS: 'saved_lessons',
  PROGRESS_QUEUE: 'progress_queue',
  SYNCED_PROGRESS: 'synced_progress',
};

// Open and initialize IndexedDB database
function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Saved Lessons store: keyed by lesson ID
      if (!db.objectStoreNames.contains(STORES.LESSONS)) {
        db.createObjectStore(STORES.LESSONS, { keyPath: 'id' });
      }

      // 2. Progress Queue store: pending offline updates with unique updateId (FR-5.4)
      if (!db.objectStoreNames.contains(STORES.PROGRESS_QUEUE)) {
        const queueStore = db.createObjectStore(STORES.PROGRESS_QUEUE, { keyPath: 'updateId' });
        queueStore.createIndex('lessonId', 'lessonId', { unique: false });
        queueStore.createIndex('status', 'status', { unique: false });
      }

      // 3. Synced Progress store: finalized confirmed records
      if (!db.objectStoreNames.contains(STORES.SYNCED_PROGRESS)) {
        db.createObjectStore(STORES.SYNCED_PROGRESS, { keyPath: 'lessonId' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Generic transaction helper
async function performTransaction(storeName, mode, callback) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);

    callback(store, resolve, reject);
  });
}

// --- Lessons Offline Operations (FR-4.1, FR-4.2) ---

export async function saveLessonToIDB(lesson) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.LESSONS, 'readwrite');
    const store = tx.objectStore(STORES.LESSONS);
    const request = store.put({
      ...lesson,
      savedAt: new Date().toISOString(),
    });

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

export async function removeLessonFromIDB(lessonId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.LESSONS, 'readwrite');
    const store = tx.objectStore(STORES.LESSONS);
    const request = store.delete(lessonId);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllSavedLessonsFromIDB() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.LESSONS, 'readonly');
    const store = tx.objectStore(STORES.LESSONS);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function isLessonSavedInIDB(lessonId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.LESSONS, 'readonly');
    const store = tx.objectStore(STORES.LESSONS);
    const request = store.get(lessonId);

    request.onsuccess = () => resolve(Boolean(request.result));
    request.onerror = () => reject(request.error);
  });
}

// --- Offline Progress Queue Operations (FR-5.1, FR-5.4, FR-5.7) ---

export async function enqueueProgressToIDB(progressRecord) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PROGRESS_QUEUE, 'readwrite');
    const store = tx.objectStore(STORES.PROGRESS_QUEUE);
    const request = store.put(progressRecord);

    request.onsuccess = () => resolve(progressRecord);
    request.onerror = () => reject(request.error);
  });
}

export async function getPendingProgressFromIDB() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PROGRESS_QUEUE, 'readonly');
    const store = tx.objectStore(STORES.PROGRESS_QUEUE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function removeProgressFromQueue(updateId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PROGRESS_QUEUE, 'readwrite');
    const store = tx.objectStore(STORES.PROGRESS_QUEUE);
    const request = store.delete(updateId);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

export async function clearAllPendingQueue() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PROGRESS_QUEUE, 'readwrite');
    const store = tx.objectStore(STORES.PROGRESS_QUEUE);
    const request = store.clear();

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

// Clear all offline storage (Maintenance & cache clear)
export async function clearAllOfflineIDB() {
  const db = await openDB();
  const tx = db.transaction([STORES.LESSONS, STORES.PROGRESS_QUEUE, STORES.SYNCED_PROGRESS], 'readwrite');
  tx.objectStore(STORES.LESSONS).clear();
  tx.objectStore(STORES.PROGRESS_QUEUE).clear();
  tx.objectStore(STORES.SYNCED_PROGRESS).clear();
  return new Promise((resolve) => {
    tx.oncomplete = () => resolve(true);
  });
}

