// src/features/ai/components/EmptyState.tsx
import { Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

/** مفاتيح الاقتراحات – النصّ يُترجَم عند العرض */
const SUGGESTION_KEYS = [
  "summarize",
  "explain",
  "studyPlan",
  "reviewQuestions",
] as const;

interface EmptyStateProps {
  onPick: (text: string) => void;
}

export default function EmptyState({ onPick }: EmptyStateProps) {
  const { t } = useTranslation("ai");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-lg shadow-[#404293]/25 mb-4">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      <h2 className={`text-[18px] font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
        {t("empty.heading")}
      </h2>
      <p className={`mt-1.5 text-[13px] max-w-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        {t("empty.subtitle")}
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
        {SUGGESTION_KEYS.map((key) => {
          const suggestion = t(`empty.suggestions.${key}`);
          return (
          <button
            key={key}
            onClick={() => onPick(suggestion)}
            dir="auto"
            className={`text-start text-[12.5px] rounded-xl border px-3.5 py-3 transition-all ${
              isDark
                ? "border-white/10 text-gray-300 hover:bg-white/6 hover:border-white/20"
                : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            {suggestion}
          </button>
          );
        })}
      </div>
    </div>
  );
}
