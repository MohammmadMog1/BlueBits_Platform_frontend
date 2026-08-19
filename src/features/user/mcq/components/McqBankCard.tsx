import { useTheme } from "next-themes";
import { BrainCircuit, CalendarCheck, ListChecks, Play } from "lucide-react";
import type { QuestionBank } from "../../../admin/questionBanks/types";
import {
  formatDateTime,
  getLectureTitle,
  getSubjectName,
} from "../../../admin/questionBanks/utils/bank";

interface McqBankCardProps {
  bank: QuestionBank;
  onStart: () => void;
}

export function McqBankCard({ bank, onStart }: McqBankCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`group rounded-xl sm:rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl overflow-hidden backdrop-blur-md
        ${isDark ? "bg-white/5 border-white/10 hover:border-[#2376BB]/40" : "bg-white/90 border-gray-200 hover:shadow-[#404293]/10"}`}
    >
      <div className="h-1 w-full bg-gradient-to-r from-[#404293] to-[#2376BB]" />
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 p-3 sm:p-5">
        <div className="relative flex-shrink-0 self-start">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-[#404293]/30">
            <BrainCircuit className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
          </div>
          <span className="absolute -bottom-1 -right-1 text-[8px] font-black px-1.5 py-0.5 rounded-md text-white shadow-sm bg-[#2376BB]">
            MCQ
          </span>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3
            className={`font-bold text-sm sm:text-base leading-snug mb-2 line-clamp-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            {getLectureTitle(bank) || bank.title}
          </h3>

          <div
            className={`flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            <span className="flex items-center gap-1">
              <ListChecks
                size={11}
                className={isDark ? "text-gray-500" : "text-gray-300"}
              />
              <span className="text-[#2376BB] font-bold">
                {bank.questionCount ?? 0}
              </span>{" "}
              سؤال
            </span>
            <span className="flex items-center gap-1">
              <CalendarCheck
                size={11}
                className={isDark ? "text-gray-500" : "text-gray-300"}
              />
              {formatDateTime(bank.publishedAt ?? bank.createdAt)}
            </span>
            <span className="truncate">{getSubjectName(bank)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end flex-shrink-0">
          <button
            onClick={onStart}
            disabled={(bank.questionCount ?? 0) === 0}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#404293]/25 hover:shadow-[#404293]/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed transition-all"
          >
            <Play size={14} />
            {(bank.questionCount ?? 0) === 0 ? "لا أسئلة" : "ابدأ الحل"}
          </button>
        </div>
      </div>
    </div>
  );
}
