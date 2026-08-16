import { useTheme } from "next-themes";
import { Eye, Download, Calendar, FileText } from "lucide-react";
import type { LecturePopulated } from "../types";

interface LectureCardProps {
  lecture: LecturePopulated;
  onView: (lecture: LecturePopulated) => void;
  onDownload: (lecture: LecturePopulated) => void;
}

const formatFileSize = (bytes: number): string => {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
};

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

export function LectureCard({ lecture, onView, onDownload }: LectureCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl md:rounded-[2rem] border transition-all hover:-translate-y-1 sm:hover:-translate-y-1.5 hover:shadow-lg backdrop-blur-md
        ${isDark ? "bg-white/5 border-white/10 hover:border-[#2376BB]/50 hover:bg-white/10" : "bg-white/80 border-gray-200 hover:border-[#2376BB]/50 shadow-sm hover:shadow-[#2376BB]/15"}`}
    >
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-[#2376BB] flex-shrink-0" />
          <h3
            className={`font-extrabold text-sm sm:text-base md:text-lg truncate ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            {lecture.title}
          </h3>
        </div>

        {lecture.description && (
          <p
            className={`text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {lecture.description}
          </p>
        )}

        <div
          className={`flex items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm font-semibold ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          <span className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#2376BB]" />
            {formatDate(lecture.createdAt)}
          </span>
          {lecture.fileSize > 0 && (
            <span>{formatFileSize(lecture.fileSize)}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-200/50 dark:border-white/10">
        <button
          onClick={() => onView(lecture)}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 rounded-xl sm:rounded-xl md:rounded-2xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white text-xs sm:text-sm md:text-base font-bold hover:opacity-90 transition-all hover:scale-105 shadow-md"
        >
          <Eye className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          View
        </button>
        <button
          onClick={() => onDownload(lecture)}
          className={`p-2.5 sm:p-3 md:p-3.5 rounded-xl sm:rounded-xl md:rounded-2xl border transition-all hover:scale-105 shadow-sm ${isDark ? "border-white/20 bg-white/5 hover:bg-white/20 text-white" : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700"}`}
        >
          <Download className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
}