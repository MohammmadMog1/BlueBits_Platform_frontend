// src/features/ai/hooks/useAiChat.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { useAskAiMutation, useGetConversationByIdQuery } from "../api/aiApi";
import type { ChatMessage, RawConversationMessage } from "../types/ai.types";

let localIdCounter = 0;
const nextLocalId = () => `local-${Date.now()}-${localIdCounter++}`;

function normalizeMessages(raw: RawConversationMessage[] | undefined): ChatMessage[] {
  if (!raw || raw.length === 0) return [];

  const out: ChatMessage[] = [];
  raw.forEach((m, index) => {
    if (m.question) {
      out.push({
        id: `${index}-q`,
        role: "user",
        content: m.question,
        createdAt: m.createdAt ?? "",
      });
    }
    if (m.answer) {
      out.push({
        id: `${index}-a`,
        role: "assistant",
        content: m.answer,
        createdAt: m.createdAt ?? "",
      });
    }
    if (m.role && m.content) {
      out.push({
        id: `${index}-${m.role}`,
        role: m.role === "assistant" || m.role === "model" ? "assistant" : "user",
        content: m.content,
        createdAt: m.createdAt ?? "",
      });
    }
  });
  return out;
}

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object") {
    const anyErr = err as Record<string, unknown>;
    if (typeof anyErr.error === "string") return anyErr.error;
    if (typeof anyErr.data === "string") return anyErr.data;
    const data = anyErr.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (typeof anyErr.message === "string") return anyErr.message;
  }
  return "تعذّر الحصول على رد من المساعد الذكي. حاول مرة أخرى.";
}

export function useAiChat() {
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sendError, setSendError] = useState<string | null>(null);
  const [askAi, { isLoading: isSending }] = useAskAiMutation();

  const { data: conversation, isFetching: isFetchingConversation } =
    useGetConversationByIdQuery(activeConversationId ?? "", {
      skip: !activeConversationId,
    });

  const loadedConversationRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (
      activeConversationId &&
      conversation &&
      loadedConversationRef.current !== activeConversationId
    ) {
      setMessages(normalizeMessages(conversation.messages));
      loadedConversationRef.current = activeConversationId;
    }
  }, [activeConversationId, conversation]);

  const startNewConversation = useCallback(() => {
    setActiveConversationId(undefined);
    setMessages([]);
    setSendError(null);
    loadedConversationRef.current = undefined;
  }, []);

  const openConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setMessages([]);
    setSendError(null);
    loadedConversationRef.current = undefined;
  }, []);

  const send = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || isSending) return;

      setSendError(null);
      const userMessage: ChatMessage = {
        id: nextLocalId(),
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };
      const pendingId = nextLocalId();
      const pendingMessage: ChatMessage = {
        id: pendingId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
        pending: true,
      };

      setMessages((prev) => [...prev, userMessage, pendingMessage]);

      try {
        const result = await askAi({
          question: trimmed,
          conversationId: activeConversationId,
        }).unwrap();

        setMessages((prev) =>
          prev.map((m) =>
            m.id === pendingId ? { ...m, content: result.answer, pending: false } : m,
          ),
        );

        if (!activeConversationId) {
          setActiveConversationId(result.conversationId);
          loadedConversationRef.current = result.conversationId;
        }
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== pendingId));
        setSendError(getErrorMessage(err));
      }
    },
    [askAi, activeConversationId, isSending],
  );

  return {
    activeConversationId,
    messages,
    isSending,
    isLoadingConversation: isFetchingConversation && !!activeConversationId,
    sendError,
    send,
    startNewConversation,
    openConversation,
  };
}
