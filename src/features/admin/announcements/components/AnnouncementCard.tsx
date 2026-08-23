import { Edit3, GraduationCap, Trash2, UserRound } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useFormatters } from "../../../../shared/i18n/useFormatters";
import { cardClass, dividerClass, faintClass, headingClass } from "../../../../shared/utils/theme";
import type { Announcement } from "../types";

interface AnnouncementCardProps {
  announcement: Announcement;
  isDark: boolean;
  onEdit: (announcement: Announcement) => void;
  onDelete: (announcement: Announcement) => void;
}

const yearName = (yearId: Announcement["yearId"]) =>
  typeof yearId === "object" && yearId !== null ? yearId.name : "—";

const creatorName = (createdBy: Announcement["createdBy"]) =>
  typeof createdBy === "object" && createdBy !== null ? createdBy.name : "—";

export default function AnnouncementCard({
  announcement,
  isDark,
  onEdit,
  onDelete,
}: AnnouncementCardProps) {
  const { t } = useTranslation("announcements");
  const { formatDateTimeOrDash } = useFormatters();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#404293]/8 ${cardClass(isDark)}`}
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-[#404293] to-[#2376BB]" />
      <div className="p-5">
        <h3
          className={`mb-2 line-clamp-2 text-base font-black leading-snug transition-colors ${headingClass(isDark)} ${
            isDark ? "group-hover:text-[#7fb5e4]" : "group-hover:text-[#404293]"
          }`}
        >
          {announcement.title}
        </h3>
        <p className={`mb-4 line-clamp-3 text-xs leading-relaxed ${faintClass(isDark)}`}>
          {announcement.content}
        </p>
        <div className="mb-4 flex flex-wrap gap-1.5">
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              isDark ? "bg-[#2376BB]/15 text-[#7fb5e4]" : "bg-[#404293]/8 text-[#404293]"
            }`}
          >
            <GraduationCap className="h-3 w-3" /> {yearName(announcement.yearId)}
          </span>
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              isDark ? "bg-violet-500/12 text-violet-400" : "bg-[#2376BB]/8 text-[#2376BB]"
            }`}
          >
            <UserRound className="h-3 w-3" /> {creatorName(announcement.createdBy)}
          </span>
        </div>
        <p className={`mb-4 text-[11px] font-semibold ${faintClass(isDark)}`}>
          {formatDateTimeOrDash(announcement.createdAt)}
        </p>
        <div className={`flex items-center gap-2 border-t pt-3 ${dividerClass(isDark)}`}>
          <button
            type="button"
            onClick={() => onEdit(announcement)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent py-2 text-xs font-semibold transition-all ${
              isDark
                ? "text-gray-400 hover:border-[#2376BB]/20 hover:bg-[#2376BB]/10 hover:text-[#2376BB]"
                : "text-gray-500 hover:border-[#404293]/15 hover:bg-[#404293]/6 hover:text-[#404293]"
            }`}
          >
            <Edit3 size={12} /> {t("admin.card.edit")}
          </button>
          <button
            type="button"
            onClick={() => onDelete(announcement)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent py-2 text-xs font-semibold transition-all ${
              isDark
                ? "text-gray-500 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                : "text-gray-400 hover:border-red-100 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <Trash2 size={12} /> {t("admin.card.delete")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
