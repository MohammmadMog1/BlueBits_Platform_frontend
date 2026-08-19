import { BookMarked, FileText } from "lucide-react";
import SectionCard from "../../../../shared/components/Dashboard/SectionCard";
import SectionEmpty from "../../../../shared/components/Dashboard/SectionEmpty";
import {
  bodyClass,
  brandGradient,
  faintClass,
  mutedClass,
  skeletonClass,
} from "../../../../shared/utils/theme";
import type { ContentMetrics } from "../types";

interface SubjectsLoadPanelProps {
  content: ContentMetrics;
  isDark: boolean;
  isLoading: boolean;
}

/** أكثر المواد امتلاءً بالمحاضرات — يكشف المواد الفارغة التي تحتاج رفع محتوى */
export default function SubjectsLoadPanel({
  content,
  isDark,
  isLoading,
}: SubjectsLoadPanelProps) {
  return (
    <SectionCard
      icon={BookMarked}
      title="المواد الأكثر محتوى"
      hint={`${content.lectures} محاضرة — ${content.theoretical} نظري / ${content.practical} عملي`}
      tone="violet"
      isDark={isDark}
      to="/admin/lectures"
      toLabel="إدارة المحاضرات"
    >
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className={`h-9 w-full ${skeletonClass(isDark)}`} />
          ))}
        </div>
      ) : content.topSubjects.length === 0 ? (
        <SectionEmpty
          icon={FileText}
          title="لا توجد محاضرات مرفوعة"
          hint="ابدأ برفع أول محاضرة لتظهر الإحصاءات"
          isDark={isDark}
        />
      ) : (
        <ul className="space-y-3">
          {content.topSubjects.map((subject) => (
            <li key={subject.subjectId}>
              <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                <span className={`truncate font-bold ${bodyClass(isDark)}`}>
                  {subject.subjectName}
                </span>
                <span className={`shrink-0 font-black ${mutedClass(isDark)}`}>
                  {subject.totalLectures}
                  <span className={faintClass(isDark)}>
                    {" "}
                    ({subject.theoreticalCount}ن / {subject.practicalCount}ع)
                  </span>
                </span>
              </div>
              <div
                className={`h-1.5 w-full overflow-hidden rounded-full ${
                  isDark ? "bg-white/10" : "bg-gray-100"
                }`}
              >
                <div
                  className={`h-full rounded-full ${brandGradient} transition-all duration-700`}
                  style={{ width: `${Math.max(subject.percentage, 2)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
