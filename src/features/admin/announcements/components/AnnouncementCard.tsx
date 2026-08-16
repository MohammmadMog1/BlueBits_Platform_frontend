import { Edit3, GraduationCap, Trash2, UserRound } from "lucide-react";
import { motion } from "motion/react";
import type { Announcement } from "../types";

interface AnnouncementCardProps {
  announcement: Announcement;
  onEdit: (announcement: Announcement) => void;
  onDelete: (announcement: Announcement) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" });

const yearName = (yearId: Announcement["yearId"]) =>
  typeof yearId === "object" && yearId !== null ? yearId.name : "—";

const creatorName = (createdBy: Announcement["createdBy"]) =>
  typeof createdBy === "object" && createdBy !== null ? createdBy.name : "—";

export default function AnnouncementCard({
  announcement,
  onEdit,
  onDelete,
}: AnnouncementCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#404293]/8"
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-[#404293] to-[#2376BB]" />
      <div className="p-5">
        <h3 className="mb-2 line-clamp-2 text-base font-black leading-snug text-gray-900 transition-colors group-hover:text-[#404293]">
          {announcement.title}
        </h3>
        <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-gray-400">
          {announcement.content}
        </p>
        <div className="mb-4 flex flex-wrap gap-1.5">
          <span className="flex items-center gap-1 rounded-full bg-[#404293]/8 px-2.5 py-1 text-[11px] font-bold text-[#404293]">
            <GraduationCap className="h-3 w-3" /> {yearName(announcement.yearId)}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-[#2376BB]/8 px-2.5 py-1 text-[11px] font-bold text-[#2376BB]">
            <UserRound className="h-3 w-3" /> {creatorName(announcement.createdBy)}
          </span>
        </div>
        <p className="mb-4 text-[11px] font-semibold text-gray-400">
          {formatDate(announcement.createdAt)}
        </p>
        <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
          <button
            type="button"
            onClick={() => onEdit(announcement)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent py-2 text-xs font-semibold text-gray-500 transition-all hover:border-[#404293]/15 hover:bg-[#404293]/6 hover:text-[#404293]"
          >
            <Edit3 size={12} /> تعديل
          </button>
          <button
            type="button"
            onClick={() => onDelete(announcement)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent py-2 text-xs font-semibold text-gray-400 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={12} /> حذف
          </button>
        </div>
      </div>
    </motion.div>
  );
}
