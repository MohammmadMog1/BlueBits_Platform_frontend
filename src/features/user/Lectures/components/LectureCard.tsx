import { useTheme } from "next-themes";
import { Eye, Download, Clock, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFormatters } from "../../../../shared/i18n/useFormatters";
import type { LecturePopulated } from "../types";
import { LectureInteractions } from "../interactions";

interface LectureCardProps {
  lecture: LecturePopulated;
  onView: (lecture: LecturePopulated) => void;
  onDownload: (lecture: LecturePopulated) => void;
}

export function LectureCard({ lecture, onView, onDownload }: LectureCardProps) {
  const { t } = useTranslation("lectures");
  const { formatShortDate } = useFormatters();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isPractical = lecture.type === "practical";

  return (
    <div
      className={`group rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg overflow-hidden backdrop-blur-md
        ${isDark ? "bg-white/[0.04] border-white/10 hover:border-[#2376BB]/40 hover:shadow-black/20" : "bg-white/95 border-gray-100 hover:shadow-[#404293]/8"}`}
    >
      <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5">
        <div
          className={`flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-xl shadow-sm ${
            isPractical
              ? "bg-gradient-to-br from-emerald-400 to-teal-500"
              : "bg-gradient-to-br from-[#404293] to-[#2376BB]"
          }`}
        >
          <FileText className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-white" />
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className={`truncate text-[13px] sm:text-sm font-bold leading-snug ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            {lecture.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span
              className={`flex items-center gap-1 text-[11px] font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              <Clock size={10} />
              {formatShortDate(lecture.createdAt)}
            </span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                isPractical
                  ? isDark
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-emerald-50 text-emerald-600"
                  : isDark
                    ? "bg-[#2376BB]/15 text-[#7fb5e4]"
                    : "bg-[#404293]/8 text-[#404293]"
              }`}
            >
              {t(isPractical ? "type.practical" : "type.theoretical")}
            </span>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-1.5">
          <button
            onClick={() => onView(lecture)}
            aria-label={t("card.view")}
            className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#404293] to-[#2376BB] px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90 sm:px-3 sm:text-xs"
          >
            <Eye size={12} />
            <span className="hidden sm:inline">{t("card.view")}</span>
          </button>
          <button
            onClick={() => onDownload(lecture)}
            aria-label={t("card.download")}
            className={`flex h-7 w-7 items-center justify-center rounded-lg border text-[11px] font-semibold transition-all sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs ${
              isDark
                ? "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Download size={12} />
            <span className="hidden sm:inline">{t("card.download")}</span>
          </button>
        </div>
      </div>

      <div className="px-3 sm:px-3.5 pb-3">
        <LectureInteractions lectureId={lecture._id} isDark={isDark} />
      </div>
    </div>
  );
}
