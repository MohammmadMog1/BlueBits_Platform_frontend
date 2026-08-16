import apiClient from "../../../../shared/api/apiClient"; // تأكد من صحة المسار
import type {
  Lecture,
  LectureFilters,
  LectureUploadPayload,
  LectureUpdatePayload,
  LecturePopulated,
  LectureDownloadInfo,
  LectureSubjectStats,
} from "../types"; // تأكد من صحة المسار لملف types.ts

// ==============================
// Unwrap Helpers (Smart Unwrapping)
// ==============================

/**
 * دالة ذكية لفك التغليف المزدوج (AxiosResponse + Bluebits Envelope)
 * تتعامل مع:
 * 1. AxiosResponse -> { data: { isSuccess, message, data: T } }
 * 2. Bluebits Envelope -> { isSuccess, message, data: T }
 * 3. البيانات المباشرة -> T
 */
const unwrapData = <T>(response: any): T => {
  // 1. إذا كانت الاستجابة من Axios، نأخذ response.data
  const apiRes = response?.data ?? response;
  // 2. إذا كانت مغلفة بـ Bluebits Envelope، نأخذ apiRes.data
  return (apiRes?.data ?? apiRes) as T;
};

/**
 * يستخرج قائمة المحاضرات من استجابة الـ API
 * يدعم: Array مباشر أو Object يحتوي على { count, lectures: [...] }
 */
const unwrapLectureList = (response: any): LecturePopulated[] => {
  const payload = unwrapData<any>(response);
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.lectures)) return payload.lectures;
  return [];
};

/**
 * يستخرج عنصر واحد من استجابة الـ API
 */
const unwrapLectureItem = <T>(response: any): T => {
  return unwrapData<T>(response);
};

// ==============================
// API Calls
// ==============================

export const fetchLecturesByFilter = async (
  filters: LectureFilters,
): Promise<LecturePopulated[]> => {
  const { subjectId, type } = filters;
  
  // استخراج yearId و semesterId إذا كانت الفلتر شاملاً
  const yearId = "yearId" in filters ? filters.yearId : undefined;
  const semesterId = "semesterId" in filters ? filters.semesterId : undefined;

  if (!subjectId || !type) {
    throw new Error("Missing lecture filters.");
  }

  const candidateUrls = [
    yearId && semesterId
      ? `/lectures/year/${yearId}/semester/${semesterId}/subject/${subjectId}/type/${type}`
      : null,
    `/lectures/subject/${subjectId}/type/${type}`,
    `/lectures/subject/${subjectId}`,
  ].filter(Boolean) as string[];

  let lastError: unknown;

  for (const url of candidateUrls) {
    try {
      const response = await apiClient.get(url);
      return unwrapLectureList(response);
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status;

      // 404 و 400 يعني أن الـ endpoint غير موجود أو الفلتر غير دقيق، نجرب الـ fallback
      if (status && status !== 404 && status !== 400) {
        throw error;
      }
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }
  return [];
};

export const uploadLecture = async (
  payload: LectureUploadPayload,
  onUploadProgress?: (percent: number) => void,
): Promise<Lecture> => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description ?? "");
  formData.append("subjectId", payload.subjectId);
  formData.append("type", payload.type);
  
  if (typeof payload.isPublished !== "undefined") {
    formData.append("isPublished", String(payload.isPublished));
  }
  
  formData.append("lecture", payload.file);

  const response = await apiClient.post("/lectures", formData, {
    onUploadProgress: (event) => {
      if (!event.total) return;
      const percentComplete = Math.round((event.loaded * 100) / event.total);
      onUploadProgress?.(percentComplete);
    },
  });

  return unwrapLectureItem<Lecture>(response);
};

export const updateLecture = async (
  id: string,
  data: LectureUpdatePayload["data"],
  onUploadProgress?: (percent: number) => void,
): Promise<LecturePopulated> => {
  const formData = new FormData();

  if (data.title) formData.append("title", data.title);
  if (typeof data.description !== "undefined") {
    formData.append("description", data.description ?? "");
  }
  if (typeof data.isPublished !== "undefined") {
    formData.append("isPublished", String(data.isPublished));
  }
  if (data.lecture instanceof File) {
    formData.append("lecture", data.lecture);
  }

  const response = await apiClient.patch(`/lectures/${id}`, formData, {
    onUploadProgress: (event) => {
      if (!event.total) return;
      const percentComplete = Math.round((event.loaded * 100) / event.total);
      onUploadProgress?.(percentComplete);
    },
  });

  return unwrapLectureItem<LecturePopulated>(response);
};

export const deleteLecture = async (id: string): Promise<void> => {
  await apiClient.delete(`/lectures/${id}`);
};

export const getLectureDownloadInfo = async (
  id: string,
): Promise<LectureDownloadInfo> => {
  const response = await apiClient.get(`/lectures/${id}/download`);
  return unwrapLectureItem<LectureDownloadInfo>(response);
};

/**
 * تقوم بتنزيل الملف الفعلي كـ Blob.
 * نستخدم fetch بدلاً من axios لأن الرابط (downloadUrl) خارجي من Cloudinary
 */
export const downloadLectureAsBlob = async (
  id: string,
): Promise<Blob> => {
  const info = await getLectureDownloadInfo(id);
  if (!info.downloadUrl) throw new Error("No download URL provided by API");
  
  const fileResponse = await fetch(info.downloadUrl);
  if (!fileResponse.ok) throw new Error("Failed to download file from Cloudinary");
  return fileResponse.blob();
};

export const getLecture = async (id: string): Promise<LecturePopulated> => {
  const response = await apiClient.get(`/lectures/${id}`);
  return unwrapLectureItem<LecturePopulated>(response);
};

// ✅ دالة الإحصائيات (سترجع المصفوفة الآن بشكل صحيح بفضل unwrapData)
export const getLecturesCountPerSubject = async (): Promise<LectureSubjectStats[]> => {
  const response = await apiClient.get("/lectures/stats/per-subject");
  return unwrapLectureItem<LectureSubjectStats[]>(response);
};