import { Megaphone } from "lucide-react";
import SectionCard from "../../../../shared/components/Dashboard/SectionCard";
import SectionEmpty from "../../../../shared/components/Dashboard/SectionEmpty";
import {
  bodyClass,
  faintClass,
  skeletonClass,
  softBoxClass,
} from "../../../../shared/utils/theme";
import { formatShortDate } from "../../../../shared/utils/datetime";
import type { Announcement } from "../../announcements/types";

interface LatestAnnouncementsPanelProps {
  announcements: Announcement[];
  isDark: boolean;
  isLoading: boolean;
}

const yearName = (announcement: Announcement): string =>
  typeof announcement.yearId === "object" ? announcement.yearId.name : "كل السنوات";

export default function LatestAnnouncementsPanel({
  announcements,
  isDark,
  isLoading,
}: LatestAnnouncementsPanelProps) {
  return (
    <SectionCard
      icon={Megaphone}
      title="أحدث الإعلانات"
      hint="آخر ما نُشر للطلاب"
      tone="sky"
      isDark={isDark}
      to="/admin/announcements"
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
          title="لا توجد إعلانات"
          hint="أنشئ أول إعلان لتصل الطلاب"
          isDark={isDark}
        />
      ) : (
        <ul className="space-y-2.5">
          {announcements.map((announcement) => (
            <li key={announcement._id} className={`px-3.5 py-3 ${softBoxClass(isDark)}`}>
              <div className="flex items-center justify-between gap-3">
                <p className={`truncate text-xs font-bold ${bodyClass(isDark)}`}>
                  {announcement.title}
                </p>
                <span className={`shrink-0 text-[10px] font-bold ${faintClass(isDark)}`}>
                  {formatShortDate(announcement.createdAt)}
                </span>
              </div>
              <p className={`mt-1 line-clamp-1 text-[11px] ${faintClass(isDark)}`}>
                {yearName(announcement)} · {announcement.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
