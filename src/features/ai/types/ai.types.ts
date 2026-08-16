// src/features/ai/types/ai.types.ts

export interface ApiEnvelope<T> {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  data: T | null;
}

export interface AskAiPayload {
  question: string;
  conversationId?: string;
}

export interface AskAiResult {
  conversationId: string;
  title: string;
  question: string;
  answer: string;
}

export interface ConversationSummary {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

/** شكل الرسالة كما يُحتمل أن يعيده الـ backend داخل history المحادثة */
export interface RawConversationMessage {
  role?: string;
  content?: string;
  question?: string;
  answer?: string;
  createdAt?: string;
}

export interface ConversationDetail {
  _id: string;
  userId: string;
  title: string;
  messages: RawConversationMessage[];
  createdAt: string;
  updatedAt: string;
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  pending?: boolean;
  error?: boolean;
}
