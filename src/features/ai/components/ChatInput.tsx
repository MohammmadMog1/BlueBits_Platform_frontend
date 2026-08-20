// src/features/ai/components/ChatInput.tsx
import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Send } from "lucide-react";
import { useTheme } from "next-themes";

interface ChatInputProps {
  onSend: (value: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const { t } = useTranslation("ai");
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const resetHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    resetHeight();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div
      className={`flex items-end gap-2 rounded-2xl border p-2 shadow-sm transition-colors ${
        isDark
          ? "bg-[#1a1b1e] border-white/10 focus-within:border-[#2376BB]/60"
          : "bg-white border-gray-200 focus-within:border-[#404293]/40"
      }`}
    >
      <textarea
        ref={textareaRef}
        dir="auto"
        rows={1}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={t("input.placeholder")}
        className={`flex-1 resize-none bg-transparent px-2 py-2 text-[14px] outline-none max-h-40 placeholder:text-gray-400 ${
          isDark ? "text-gray-100" : "text-gray-800"
        }`}
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        aria-label={t("input.send")}
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-r from-[#404293] to-[#2376BB] shadow-md shadow-[#404293]/25 transition-all hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {disabled ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      </button>
    </div>
  );
}
