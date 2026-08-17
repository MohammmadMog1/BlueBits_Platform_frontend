import { useTheme } from "next-themes";
import { Eye, Download, Clock, File, FileText } from "lucide-react";
import type { LecturePopulated } from "../types";
import { LectureInteractions } from "../interactions";

interface LectureCardProps {
  lecture: LecturePopulated;
  onView: (lecture: LecturePopulated) => void;
  onDownload: (lecture: LecturePopulated) => void;
}

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

export function LectureCard({ lecture, onView, onDownload }: LectureCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isPractical = lecture.type === "practical";

  return (
    <div
      className={`group rounded-xl sm:rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl overflow-hidden backdrop-blur-md
        ${isDark ? "bg-white/5 border-white/10 hover:border-[#2376BB]/40" : "bg-white/90 border-gray-200 hover:shadow-[#404293]/10"}`}
    >
      <div
        className={`h-1 w-full ${
          isPractical
            ? "bg-gradient-to-r from-emerald-400 to-teal-500"
            : "bg-gradient-to-r from-[#404293] to-[#2376BB]"
        }`}
      />
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-5">
        <div className="relative flex-shrink-0 self-start">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg ${
              isPractical
                ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-200/40"
                : "bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-[#404293]/30"
            }`}
          >
            <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <span
            className={`absolute -bottom-1 -right-1 text-[8px] font-black px-1.5 py-0.5 rounded-md text-white shadow-sm ${
              isPractical ? "bg-emerald-500" : "bg-[#404293]"
            }`}
          >
            {isPractical ? "LAB" : "PDF"}
          </span>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3
            className={`font-bold text-sm sm:text-base leading-snug mb-2 line-clamp-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            {lecture.title}
          </h3>

          <div
            className={`flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            <span className="flex items-center gap-1">
              <Clock size={11} className={isDark ? "text-gray-500" : "text-gray-300"} />
              {formatDate(lecture.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <File size={11} className={isDark ? "text-gray-500" : "text-gray-300"} />
              {lecture.type}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 pt-1">
          <button
            onClick={() => onView(lecture)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-90 hover:-translate-y-0.5 transition-all"
          >
            <Eye size={14} /> View
          </button>
          <button
            onClick={() => onDownload(lecture)}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${isDark ? "border-white/20 bg-white/5 hover:bg-white/15 text-gray-100" : "border-gray-200 bg-white hover:bg-gray-50 text-gray-600"}`}
          >
            <Download size={14} /> Download
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
        <LectureInteractions lectureId={lecture._id} isDark={isDark} />
      </div>
    </div>
  );
}