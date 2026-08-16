const STORAGE_PREFIX = "recentDownloads";

interface DownloadEntry {
  lectureId: string;
  downloadedAt: string;
}

const getKey = (userId: string) => `${STORAGE_PREFIX}:${userId}`;

export const recordDownload = (userId: string, lectureId: string): void => {
  if (!userId || !lectureId) return;
  try {
    const key = getKey(userId);
    const raw = localStorage.getItem(key);
    const list: DownloadEntry[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((entry) => entry.lectureId !== lectureId);
    filtered.unshift({ lectureId, downloadedAt: new Date().toISOString() });
    const trimmed = filtered.slice(0, 20);
    localStorage.setItem(key, JSON.stringify(trimmed));
  } catch {
    // localStorage ممكن يكون غير متاح (Private Browsing مثلاً)
  }
};

export const getRecentDownloadIds = (userId: string, limit: number): string[] => {
  if (!userId) return [];
  try {
    const key = getKey(userId);
    const raw = localStorage.getItem(key);
    const list: DownloadEntry[] = raw ? JSON.parse(raw) : [];
    return list.slice(0, limit).map((entry) => entry.lectureId);
  } catch {
    return [];
  }
};

export const extractYearId = (
  yearId: string | { _id: string } | null | undefined,
): string => {
  if (!yearId) return "";
  if (typeof yearId === "string") return yearId;
  return yearId._id ?? "";
};