export interface CommentAuthor {
  _id: string;
  name: string;
  profile_image: string;
}

export interface LectureComment {
  _id: string;
  userId: string | CommentAuthor;
  lectureId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface LectureCommentsResult {
  count: number;
  comments: LectureComment[];
}

export type ReactionType = "like" | "dislike";

export interface LectureReactionsSummary {
  likes: number;
  dislikes: number;
  userReaction: ReactionType | null;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  data: T;
}
