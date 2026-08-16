// src/features/ai/components/MessageBubble.tsx
import { AlertCircle, Bot, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import type { ChatMessage } from "../types/ai.types";
import { MarkdownText } from "../utils/markdown";

interface MessageBubbleProps {
  message: ChatMessage;
  userInitials: string;
}

export default function MessageBubble({ message, userInitials }: MessageBubbleProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold ${
          isUser
            ? "bg-gradient-to-br from-[#404293] to-[#2376BB] text-white"
            : isDark
            ? "bg-white/10 text-[#7ea6ff]"
            : "bg-[#404293]/10 text-[#404293]"
        }`}
      >
        {isUser ? userInitials : <Bot className="w-4 h-4" />}
      </div>

      <div
        dir="auto"
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-[14px] ${
          isUser
            ? "bg-gradient-to-r from-[#404293] to-[#2376BB] text-white"
            : isDark
            ? "bg-white/8 text-gray-100"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {message.pending ? (
          <span className="flex items-center gap-2 opacity-70">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span className="text-[13px]">المساعد يكتب الآن...</span>
          </span>
        ) : isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : message.content ? (
          <MarkdownText text={message.content} />
        ) : (
          <span className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-3.5 h-3.5" />
            تعذّر عرض هذا الرد.
          </span>
        )}
      </div>
    </div>
  );
}
