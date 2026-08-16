export interface PopulatedYear {
  _id: string;
  name: string;
  order?: number | string;
}

export interface PopulatedCreatedBy {
  _id: string;
  name: string;
  email: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  yearId: PopulatedYear | string;
  createdBy: PopulatedCreatedBy | string;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementFormData {
  title: string;
  content: string;
  yearId: string;
}

export type CreateAnnouncementPayload = AnnouncementFormData;

export interface UpdateAnnouncementPayload {
  id: string;
  data: Partial<AnnouncementFormData>;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  data: T;
}
