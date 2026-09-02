import { BookMarked, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionCard from "../../../../shared/components/Dashboard/SectionCard";
import SectionEmpty from "../../../../shared/components/Dashboard/SectionEmpty";
import {
  bodyClass,
  brandGradient,
  faintClass,
  mutedClass,
  skeletonClass,
} from "../../../../shared/utils/theme";
import type { DoctorSubjectStats } from "../../types";

interface MySubjectsPanelProps {
  stats: DoctorSubjectStats[];
  isDark: boolean;
  isLoading: boolean;
}

/** موادي مع عدد المحاضرات وبنوك الأسئلة في كل مادة */
export default function MySubjectsPanel({ stats, isDark, isLoading }: MySubjectsPanelProps) {
  const { t } = useTranslation("doctor");

  const maxLectures = Math.max(1, ...stats.map((item) => item.lectures?.total ?? 0));

  return (
    <SectionCard
      icon={BookMarked}
      title={t("dashboard.mySubjects.title")}
      hint={t("dashboard.mySubjects.hint")}
      tone="sky"
      isDark={isDark}
      to="/doctor/subjects"
      toLabel={t("dashboard.mySubjects.manageLink")}
    >
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`h-9 w-full ${skeletonClass(isDark)}`} />
          ))}
        </div>
      ) : stats.length === 0 ? (
        <SectionEmpty
          icon={FileText}
          title={t("dashboard.mySubjects.emptyTitle")}
          hint={t("dashboard.mySubjects.emptyHint")}
          isDark={isDark}
        />
      ) : (
        <ul className="space-y-3">
          {stats.map((subject) => {
            const percentage = Math.max(
              (100 * (subject.lectures?.total ?? 0)) / maxLectures,
              2,
            );
            return (
              <li key={subject.subjectId}>
                <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                  <span className={`truncate font-bold ${bodyClass(isDark)}`}>
                    {subject.subjectName}
                  </span>
                  <span className={`shrink-0 font-black ${mutedClass(isDark)}`}>
                    {subject.lectures?.total ?? 0}
                    <span className={faintClass(isDark)}>
                      {" "}
                      {t("dashboard.mySubjects.lecturesShort")}
                    </span>
                    {" · "}
                    {subject.questionBanks?.total ?? 0}
                    <span className={faintClass(isDark)}>
                      {" "}
                      {t("dashboard.mySubjects.banksShort")}
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
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}
