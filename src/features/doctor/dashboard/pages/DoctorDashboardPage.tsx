import { AlertCircle, BookMarked, BrainCircuit, FileText, LayoutDashboard } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import DashboardHeader from "../../../../shared/components/Dashboard/DashboardHeader";
import QuickActionsPanel from "../../../../shared/components/Dashboard/QuickActionsPanel";
import StaggerGrid from "../../../../shared/components/Dashboard/StaggerGrid";
import StatTile from "../../../../shared/components/StatTile/StatTile";
import { useIsDark } from "../../../../shared/hooks/useIsDark";
import { errorAlertClass } from "../../../../shared/utils/theme";
import { useDoctorDashboard } from "../hooks/useDoctorDashboard";
import { doctorQuickActions } from "../dashboard.config";
import MySubjectsPanel from "../components/MySubjectsPanel";
import RecentLecturesPanel from "../components/RecentLecturesPanel";

/**
 * داشبورد الدكتور: نظرة عامة على موادي ومحاضراتي وبنوك أسئلتي.
 */
export default function DoctorDashboardPage() {
  const { t } = useTranslation("doctor");
  const isDark = useIsDark();
  const { stats, content, recentLectures, isLoading, isFetching, isError, refresh } =
    useDoctorDashboard();

  return (
    <div className="flex flex-col gap-5">
      <DashboardHeader
        icon={LayoutDashboard}
        title={t("dashboard.title")}
        subtitle={t("dashboard.subtitle")}
        isDark={isDark}
        isFetching={isFetching}
        onRefresh={refresh}
      />

      {isError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={errorAlertClass(isDark)}
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {t("dashboard.loadError")}
        </motion.div>
      )}

      <StaggerGrid className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          icon={BookMarked}
          label={t("dashboard.stats.subjects")}
          value={content.subjects}
          tone="sky"
          isDark={isDark}
          isLoading={isLoading}
          to="/doctor/subjects"
        />
        <StatTile
          icon={FileText}
          label={t("dashboard.stats.lectures")}
          value={content.lecturesTotal}
          hint={t("dashboard.stats.lecturesHint", {
            published: content.lecturesPublished,
            draft: content.lecturesDraft,
          })}
          tone="violet"
          isDark={isDark}
          isLoading={isLoading}
          to="/doctor/lectures"
        />
        <StatTile
          icon={BrainCircuit}
          label={t("dashboard.stats.questionBanks")}
          value={content.banksTotal}
          hint={t("dashboard.stats.questionBanksHint", {
            published: content.banksPublished,
            draft: content.banksDraft,
          })}
          tone="emerald"
          isDark={isDark}
          isLoading={isLoading}
          to="/doctor/question-banks"
        />
        <StatTile
          icon={BrainCircuit}
          label={t("dashboard.stats.totalQuestions")}
          value={content.totalQuestions}
          tone="amber"
          isDark={isDark}
          isLoading={isLoading}
          to="/doctor/question-banks"
        />
      </StaggerGrid>

      <StaggerGrid className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <MySubjectsPanel stats={stats} isDark={isDark} isLoading={isLoading} />
        <RecentLecturesPanel lectures={recentLectures} isDark={isDark} isLoading={isLoading} />
        <QuickActionsPanel actions={doctorQuickActions} isDark={isDark} />
      </StaggerGrid>
    </div>
  );
}
