import { useTheme } from "next-themes";
import { FileText, Calendar } from "lucide-react";
import type { LecturePopulated } from "../types";

// ⚠️ عدّلي هالمسار حسب مكان اللوغو الفعلي بمشروعك
import Logo from "../../../../app/assets/Logo.png";

interface LatestLectureCardProps {
  lecture: LecturePopulated;
  onClick: (lecture: LecturePopulated) => void;
}

const extractLectureNumber = (title: string): string | null => {
  const match = title.match(/(\d+)/);
  return match ? match[1] : null;
};

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

export function LatestLectureCard({ lecture, onClick }: LatestLectureCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const lectureNumber = extractLectureNumber(lecture.title);

  return (
    <button
      onClick={() => onClick(lecture)}
      className={`snap-start flex-shrink-0 w-[220px] sm:w-[250px] rounded-2xl border overflow-hidden text-left transition-all hover:-translate-y-1 hover:shadow-xl group backdrop-blur-md
        ${isDark ? "bg-white/5 border-white/10 hover:border-[#2376BB]/50" : "bg-white/90 border-gray-200 shadow-sm hover:border-[#2376BB]/40"}`}
    >
      <div
        className={`relative h-24 flex items-center justify-center ${isDark ? "bg-gradient-to-br from-[#404293]/30 to-[#2376BB]/30" : "bg-gradient-to-br from-[#404293]/10 to-[#2376BB]/10"}`}
      >
        <FileText
          className={`w-10 h-10 ${isDark ? "text-white/70" : "text-[#404293]/70"} group-hover:scale-110 transition-transform duration-500`}
        />

        <img
          src={Logo}
          alt="BlueBits"
          className="absolute top-2 right-2 w-6 h-6 rounded-md object-contain bg-white/90 p-0.5 shadow-sm"
        />

        {lectureNumber && (
          <span
            className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${isDark ? "bg-black/50 text-white" : "bg-white/90 text-[#404293]"}`}
          >
            #{lectureNumber}
          </span>
        )}
      </div>

      <div className="p-3">
        <h4
          className={`font-bold text-sm line-clamp-1 mb-1 ${isDark ? "text-gray-100" : "text-gray-900"}`}
        >
          {lecture.title}
        </h4>
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-xs font-semibold truncate ${isDark ? "text-blue-300" : "text-[#2376BB]"}`}
          >
            {lecture.subjectId?.name}
          </span>
          <span
            className={`flex items-center gap-1 text-[10px] flex-shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            <Calendar className="w-3 h-3" />
            {formatDate(lecture.createdAt)}
          </span>
        </div>
      </div>
    </button>
  );
}