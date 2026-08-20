import { Link } from "react-router-dom";
import { Megaphone } from "lucide-react";
import SectionCard from "../../../../shared/components/Dashboard/SectionCard";
import SectionEmpty from "../../../../shared/components/Dashboard/SectionEmpty";
import {
  bodyClass,
  faintClass,
  skeletonClass,
  softBoxClass,
} from "../../../../shared/utils/theme";
import { useTranslation } from "react-i18next";
import { useFormatters } from "../../../../shared/i18n/useFormatters";
import type { Announcement } from "../../../admin/announcements/types";

interface AnnouncementsPanelProps {
  announcements: Announcement[];
  isDark: boolean;
  isLoading: boolean;
}

/** إعلانات دفعة الطالب (`/announcements/my`) */
export default function AnnouncementsPanel({
  announcements,
  isDark,
  isLoading,
}: AnnouncementsPanelProps) {
  const { t } = useTranslation("dashboard");
  const { formatShortDate } = useFormatters();

  return (
    <SectionCard
      icon={Megaphone}
      title={t("announcements.title")}
      hint={t("announcements.hint")}
      tone="sky"
      isDark={isDark}
      to="/user/announcements"
    >
      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`h-16 w-full ${skeletonClass(isDark)}`} />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <SectionEmpty
          icon={Megaphone}
          title={t("announcements.emptyTitle")}
          hint={t("announcements.emptyHint")}
          isDark={isDark}
        />
      ) : (
        <ul className="space-y-2.5">
          {announcements.map((announcement) => (
            <li key={announcement._id}>
              <Link
                to="/user/announcements"
                className={`block px-3.5 py-3 transition-all hover:-translate-y-0.5 hover:shadow-md ${softBoxClass(isDark)}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className={`truncate text-xs font-bold ${bodyClass(isDark)}`}>
                    {announcement.title}
                  </p>
                  <span className={`shrink-0 text-[10px] font-bold ${faintClass(isDark)}`}>
                    {formatShortDate(announcement.createdAt)}
                  </span>
                </div>
                <p className={`mt-1 line-clamp-2 text-[11px] ${faintClass(isDark)}`}>
                  {announcement.content}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
