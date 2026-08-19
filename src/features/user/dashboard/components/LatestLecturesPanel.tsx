import { Link } from "react-router-dom";
import { BookOpen, FileText } from "lucide-react";
import SectionCard from "../../../../shared/components/Dashboard/SectionCard";
import SectionEmpty from "../../../../shared/components/Dashboard/SectionEmpty";
import {
  bodyClass,
  faintClass,
  skeletonClass,
  softBoxClass,
} from "../../../../shared/utils/theme";
import { formatShortDate } from "../../../../shared/utils/datetime";
import type { LecturePopulated } from "../../Lectures/types";

interface LatestLecturesPanelProps {
  lectures: LecturePopulated[];
  isDark: boolean;
  isLoading: boolean;
}

const typeLabel = (type: string) => (type === "practical" ? "عملي" : "نظري");

/** آخر المحاضرات المنشورة — الدخول للتفاصيل يتم من صفحة المحاضرات */
export default function LatestLecturesPanel({
  lectures,
  isDark,
  isLoading,
}: LatestLecturesPanelProps) {
  return (
    <SectionCard
      icon={BookOpen}
      title="أحدث المحاضرات"
      hint="آخر ما نُشر على المنصّة"
      tone="violet"
      isDark={isDark}
      to="/user/lectures"
    >
      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={`h-14 w-full ${skeletonClass(isDark)}`} />
          ))}
        </div>
      ) : lectures.length === 0 ? (
        <SectionEmpty
          icon={FileText}
          title="لا توجد محاضرات منشورة"
          hint="ستظهر هنا فور رفعها"
          isDark={isDark}
        />
      ) : (
        <ul className="space-y-2.5">
          {lectures.map((lecture) => (
            <li key={lecture._id}>
              <Link
                to="/user/lectures"
                className={`flex items-center gap-3 px-3.5 py-3 transition-all hover:-translate-y-0.5 hover:shadow-md ${softBoxClass(isDark)}`}
              >
                <FileText className={`h-4 w-4 shrink-0 ${faintClass(isDark)}`} />
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-xs font-bold ${bodyClass(isDark)}`}>
                    {lecture.title}
                  </p>
                  <p className={`mt-0.5 truncate text-[11px] font-semibold ${faintClass(isDark)}`}>
                    {lecture.subjectId?.name ?? "—"} · {typeLabel(lecture.type)}
                  </p>
                </div>
                <span className={`shrink-0 text-[10px] font-bold ${faintClass(isDark)}`}>
                  {formatShortDate(lecture.createdAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
