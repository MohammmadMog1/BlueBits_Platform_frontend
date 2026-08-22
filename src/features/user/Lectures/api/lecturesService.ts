import apiClient from "../../../../shared/api/apiClient";
import type {
  LectureFilters,
  LecturePopulated,
  LectureDownloadInfo,
} from "../types";

// ==============================
// Unwrap Helpers
// ==============================
const unwrapData = <T>(response: any): T => {
  const apiRes = response?.data ?? response;
  return (apiRes?.data ?? apiRes) as T;
};

const unwrapLectureList = (response: any): LecturePopulated[] => {
  const payload = unwrapData<any>(response);
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.lectures)) return payload.lectures;
  return [];
};

const unwrapLectureItem = <T>(response: any): T => {
  return unwrapData<T>(response);
};

// ==============================
// API Calls (قراءة فقط)
// ==============================

export const fetchLecturesByFilter = async (
  filters: LectureFilters,
): Promise<LecturePopulated[]> => {
  const { subjectId, type } = filters;
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
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      if (status && status !== 404 && status !== 400) {
        throw error;
      }
      lastError = error;
    }
  }

  if (lastError) throw lastError;
  return [];
};

export const getLecture = async (id: string): Promise<LecturePopulated> => {
  const response = await apiClient.get(`/lectures/${id}`);
  return unwrapLectureItem<LecturePopulated>(response);
};

export const getLectureDownloadInfo = async (
  id: string,
): Promise<LectureDownloadInfo> => {
  const response = await apiClient.get(`/lectures/${id}/download`);
  return unwrapLectureItem<LectureDownloadInfo>(response);
};

/**
 * تنزيل الملف الفعلي كـ Blob (نفس منطق الـ admin تماماً)
 */
export const downloadLectureAsBlob = async (id: string): Promise<Blob> => {
  const info = await getLectureDownloadInfo(id);
  if (!info.downloadUrl) throw new Error("No download URL provided by API");

  const fileResponse = await fetch(info.downloadUrl);
  if (!fileResponse.ok)
    throw new Error("Failed to download file from Cloudinary");
  return fileResponse.blob();
};
