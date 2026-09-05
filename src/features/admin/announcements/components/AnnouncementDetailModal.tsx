import { Edit3, GraduationCap, Megaphone, Trash2, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import BottomSheetModal from "../../../../shared/components/BottomSheetModal/BottomSheetModal";
import { useFormatters } from "../../../../shared/i18n/useFormatters";
import type { Announcement } from "../types";

interface AnnouncementDetailModalProps {
  announcement: Announcement;
  isDark: boolean;
  onClose: () => void;
  /** أزرار التعديل/الحذف تظهر فقط عند تمريرها – صفحة الإدارة تمررها، صفحة الطالب لا */
  onEdit?: (announcement: Announcement) => void;
  onDelete?: (announcement: Announcement) => void;
}

const yearName = (yearId: Announcement["yearId"]) =>
  typeof yearId === "object" && yearId !== null ? yearId.name : "—";

const creatorName = (createdBy: Announcement["createdBy"]) =>
  typeof createdBy === "object" && createdBy !== null ? createdBy.name : null;

export default function AnnouncementDetailModal({
  announcement,
  isDark,
  onClose,
  onEdit,
  onDelete,
}: AnnouncementDetailModalProps) {
  const { t } = useTranslation("announcements");
  const { formatDateTimeOrDash } = useFormatters();
  const creator = creatorName(announcement.createdBy);

  return (
    <BottomSheetModal
      onClose={onClose}
      icon={<Megaphone className="h-5 w-5 text-white" />}
      title={announcement.title}
      subtitle={formatDateTimeOrDash(announcement.createdAt)}
      isDark={isDark}
      maxWidthClassName="sm:max-w-xl"
      footer={
        onEdit || onDelete ? (
          <div className="flex gap-3">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(announcement)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                  isDark
                    ? "border-white/10 text-gray-300 hover:border-[#2376BB]/30 hover:bg-[#2376BB]/10 hover:text-[#2376BB]"
                    : "border-gray-200 text-gray-600 hover:border-[#404293]/20 hover:bg-[#404293]/6 hover:text-[#404293]"
                }`}
              >
                <Edit3 size={14} /> {t("admin.card.edit")}
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(announcement)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                  isDark
                    ? "border-white/10 text-gray-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                    : "border-gray-200 text-gray-500 hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                }`}
              >
                <Trash2 size={14} /> {t("admin.card.delete")}
              </button>
            )}
          </div>
        ) : undefined
      }
    >
      <div className="mb-5 flex flex-wrap gap-1.5">
        <span
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
            isDark ? "bg-[#2376BB]/15 text-[#7fb5e4]" : "bg-[#404293]/8 text-[#404293]"
          }`}
        >
          <GraduationCap className="h-3 w-3" /> {yearName(announcement.yearId)}
        </span>
        {creator && (
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              isDark ? "bg-violet-500/12 text-violet-400" : "bg-[#2376BB]/8 text-[#2376BB]"
            }`}
          >
            <UserRound className="h-3 w-3" /> {creator}
          </span>
        )}
      </div>
      <p
        className={`whitespace-pre-line text-sm leading-relaxed ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {announcement.content}
      </p>
    </BottomSheetModal>
  );
}
