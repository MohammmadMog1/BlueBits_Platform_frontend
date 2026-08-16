import { GraduationCap, Megaphone } from "lucide-react";
import { motion } from "motion/react";
import type { Announcement } from "../../admin/announcements";

interface StudentAnnouncementCardProps {
  announcement: Announcement;
  isDark: boolean;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" });

const yearName = (yearId: Announcement["yearId"]) =>
  typeof yearId === "object" && yearId !== null ? yearId.name : "—";

export default function StudentAnnouncementCard({
  announcement,
  isDark,
}: StudentAnnouncementCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isDark
          ? "border-white/10 bg-white/5 hover:shadow-[#2376BB]/10"
          : "border-gray-100 bg-white hover:shadow-[#404293]/8"
      }`}
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-[#404293] to-[#2376BB]" />
      <div className="p-5">
        <div className="mb-2 flex items-start gap-2">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#404293]/10">
            <Megaphone className="h-3 w-3 text-[#404293]" />
          </div>
          <h3
            className={`line-clamp-2 text-base font-black leading-snug ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {announcement.title}
          </h3>
        </div>
        <p
          className={`mb-4 whitespace-pre-line text-xs leading-relaxed ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {announcement.content}
        </p>
        <div
          className={`flex items-center justify-between gap-2 border-t pt-3 text-[11px] font-semibold ${
            isDark ? "border-white/10" : "border-gray-100"
          }`}
        >
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-bold ${
              isDark ? "bg-[#2376BB]/15 text-[#6fb3e6]" : "bg-[#404293]/8 text-[#404293]"
            }`}
          >
            <GraduationCap className="h-3 w-3" /> {yearName(announcement.yearId)}
          </span>
          <span className={isDark ? "text-gray-500" : "text-gray-400"}>
            {formatDate(announcement.createdAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
