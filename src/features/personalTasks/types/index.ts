export interface PersonalTask {
  _id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalTaskFormData {
  title: string;
  description: string;
  dueDate: string;
}

export type CreatePersonalTaskPayload = PersonalTaskFormData;

export interface UpdatePersonalTaskPayload {
  id: string;
  data: Partial<PersonalTaskFormData>;
}

export interface GetPersonalTasksParams {
  isCompleted?: boolean;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  data: T;
}
