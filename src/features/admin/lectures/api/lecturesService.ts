import type { AxiosResponse } from "axios";
import apiClient from "../../../../shared/api/apiClient";
import type {
  Lecture,
  LectureFilters,
  LectureUploadPayload,
  LectureUpdatePayload,
} from "../types";

const unwrapLectureList = (response: any): Lecture[] => {
  if (Array.isArray(response)) return response;
  return response?.data ?? response?.lectures ?? [];
};

const unwrapLectureItem = (response: any): Lecture => {
  return response?.data ?? response;
};
// //////////
export const fetchLecturesByFilter = async (
  filters: LectureFilters,
): Promise<Lecture[]> => {
  const { yearId, semesterId, subjectId, type } = filters;

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
      return unwrapLectureList(response.data);
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;

      if (status && status !== 404 && status !== 400) {
        throw error;
      }

      lastError = error;
    }
  }
//////////////////////////
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
  formData.append("yearId", payload.yearId);
  formData.append("semesterId", payload.semesterId);
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

  return unwrapLectureItem(response.data);
};

export const updateLecture = async (
  id: string,
  data: LectureUpdatePayload["data"],
  onUploadProgress?: (percent: number) => void,
): Promise<Lecture> => {
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

  return unwrapLectureItem(response.data);
};

export const deleteLecture = async (id: string): Promise<void> => {
  await apiClient.delete(`/lectures/${id}`);
};

export const downloadLecture = async (
  id: string,
): Promise<AxiosResponse<Blob>> => {
  return apiClient.get(`/lectures/${id}/download`, {
    responseType: "blob",
  });
};

export const getLecture = async (id: string): Promise<Lecture> => {
  const response = await apiClient.get(`/lectures/${id}`);
  return unwrapLectureItem(response.data);
};
