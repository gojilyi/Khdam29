export interface OfflinePendingAction {
  id: string;
  type: 'order' | 'quote' | 'message' | 'review' | 'job_post';
  title: string;
  payload: any;
  createdAt: string;
  status: 'pending' | 'syncing' | 'failed';
}

const STORAGE_KEY = 'khodam_offline_queue';
const CACHE_META_KEY = 'khodam_offline_cache_meta';

export const getOfflinePendingActions = (): OfflinePendingAction[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading offline queue:', e);
    return [];
  }
};

export const saveOfflinePendingAction = (action: Omit<OfflinePendingAction, 'id' | 'createdAt' | 'status'>): OfflinePendingAction => {
  const actions = getOfflinePendingActions();
  const newAction: OfflinePendingAction = {
    ...action,
    id: `off_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  actions.unshift(newAction);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
  } catch (e) {
    console.error('Error saving offline action:', e);
  }
  return newAction;
};

export const removeOfflinePendingAction = (id: string): void => {
  try {
    const actions = getOfflinePendingActions().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
  } catch (e) {
    console.error('Error removing offline action:', e);
  }
};

export const clearOfflinePendingActions = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing offline queue:', e);
  }
};

export const recordCacheSync = (): void => {
  try {
    localStorage.setItem(CACHE_META_KEY, JSON.stringify({
      lastSyncedAt: new Date().toISOString(),
      version: '1.0.0'
    }));
  } catch (e) {
    console.error('Error saving cache meta:', e);
  }
};

export const getCacheSyncMeta = () => {
  try {
    const raw = localStorage.getItem(CACHE_META_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
