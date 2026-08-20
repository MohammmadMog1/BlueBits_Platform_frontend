// src/features/ai/components/AiChatPage.tsx
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, Bot, PanelLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { useAppSelector } from "../../../app/store/hooks";
import { useAiChat } from "../hooks/useAiChat";
import ConversationSidebar from "./ConversationSidebar";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import EmptyState from "./EmptyState";

function getUserInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AiChatPage() {
  const { t } = useTranslation("ai");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const user = useAppSelector((state) => state.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    activeConversationId,
    messages,
    isSending,
    isLoadingConversation,
    sendError,
    send,
    startNewConversation,
    openConversation,
  } = useAiChat();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSelect = (id: string) => {
    openConversation(id);
    setSidebarOpen(false);
  };

  const handleNew = () => {
    startNewConversation();
    setSidebarOpen(false);
  };

  return (
    <div
      className={`flex h-[80vh] min-h-[560px] max-h-[860px] rounded-2xl overflow-hidden border ${
        isDark ? "border-white/8 bg-[#1a1b1e]/60" : "border-gray-200/80 bg-white"
      }`}
    >
      {/* الشريط الجانبي - سطح المكتب */}
      <div className="hidden md:block w-72 flex-shrink-0">
        <ConversationSidebar
          activeConversationId={activeConversationId}
          onSelect={handleSelect}
          onNewConversation={handleNew}
        />
      </div>

      {/* الشريط الجانبي - الجوال */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40 animate-fadeIn" onClick={() => setSidebarOpen(false)} />
          <div className={`absolute inset-y-0 start-0 w-72 animate-slideUp ${isDark ? "bg-[#1a1b1e]" : "bg-white"}`}>
            <ConversationSidebar
              activeConversationId={activeConversationId}
              onSelect={handleSelect}
              onNewConversation={handleNew}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div
          className={`flex items-center gap-3 px-4 py-3 border-b flex-shrink-0 ${
            isDark ? "border-white/8" : "border-gray-200/80"
          }`}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label={t("openConversations")}
            className={`md:hidden p-2 rounded-lg ${
              isDark ? "text-gray-400 hover:bg-white/8" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <PanelLeft className="w-4 h-4" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className={`text-[14px] font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
              {t("title")}
            </h1>
            <p className="text-[11px] text-gray-400">{t("poweredBy")}</p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
          {isLoadingConversation ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-[13px]">
              {t("loadingConversation")}
            </div>
          ) : messages.length === 0 ? (
            <EmptyState onPick={send} />
          ) : (
            messages.map((m) => (
              <MessageBubble key={m.id} message={m} userInitials={getUserInitials(user?.name)} />
            ))
          )}
        </div>

        {sendError && (
          <div
            className={`mx-4 mb-2 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[12.5px] ${
              isDark ? "bg-red-500/10 text-red-300" : "bg-red-50 text-red-600"
            }`}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{sendError}</span>
          </div>
        )}

        <div className="p-4 pt-2 flex-shrink-0">
          <ChatInput onSend={send} disabled={isSending} />
        </div>
      </div>
    </div>
  );
}
