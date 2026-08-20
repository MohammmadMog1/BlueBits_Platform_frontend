import {
  AlertCircle,
  BookMarked,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  UserCheck,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import DashboardHeader from "../../../../shared/components/Dashboard/DashboardHeader";
import QuickActionsPanel from "../../../../shared/components/Dashboard/QuickActionsPanel";
import StatTile from "../../../../shared/components/StatTile/StatTile";
import { useIsDark } from "../../../../shared/hooks/useIsDark";
import { errorAlertClass } from "../../../../shared/utils/theme";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { adminQuickActions } from "../dashboard.config";
import RoleBreakdownPanel from "../components/RoleBreakdownPanel";
import SubjectsLoadPanel from "../components/SubjectsLoadPanel";
import ClosingTasksPanel from "../components/ClosingTasksPanel";
import LatestAnnouncementsPanel from "../components/LatestAnnouncementsPanel";
import SurveyStatusPanel from "../components/SurveyStatusPanel";

/**
 * داشبورد الأدمن: نظرة عامة على المنصّة.
 * الترتيب مقصود — أرقام سريعة، ثم لوحات تحتاج قراراً، ثم اختصارات.
 */
export default function AdminDashboardPage() {
  const { t } = useTranslation("admin");
  const isDark = useIsDark();
  const {
    users,
    content,
    tasks,
    surveys,
    latestAnnouncements,
    isLoading,
    isFetching,
    isError,
    refresh,
  } = useAdminDashboard();

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

      {/* الأرقام السريعة */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <StatTile
          icon={Users}
          label={t("stats.users")}
          value={users.total}
          hint={t("stats.usersHint", { count: users.joinedLastWeek })}
          tone="brand"
          isDark={isDark}
          isLoading={isLoading}
          to="/admin/users"
        />
        <StatTile
          icon={UserCheck}
          label={t("stats.verifiedAccounts")}
          value={`${users.verifiedRate}%`}
          hint={t("stats.unverifiedHint", { count: users.unverified })}
          tone="emerald"
          isDark={isDark}
          isLoading={isLoading}
          to="/admin/users"
        />
        <StatTile
          icon={FileText}
          label={t("stats.lectures")}
          value={content.lectures}
          hint={t("stats.lecturesHint", {
            theoretical: content.theoretical,
            practical: content.practical,
          })}
          tone="violet"
          isDark={isDark}
          isLoading={isLoading}
          to="/admin/lectures"
        />
        <StatTile
          icon={BookMarked}
          label={t("stats.subjects")}
          value={content.subjects}
          tone="sky"
          isDark={isDark}
          isLoading={isLoading}
          to="/admin/subjects"
        />
        <StatTile
          icon={GraduationCap}
          label={t("stats.years")}
          value={content.years}
          tone="rose"
          isDark={isDark}
          isLoading={isLoading}
          to="/admin/academic"
        />
        <StatTile
          icon={ClipboardList}
          label={t("stats.openTasks")}
          value={tasks.open}
          hint={t("stats.totalHint", { count: tasks.total })}
          tone="amber"
          isDark={isDark}
          isLoading={isLoading}
          to="/admin/academic-tasks"
        />
      </div>

      {/* لوحات تحتاج متابعة */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <ClosingTasksPanel tasks={tasks} isDark={isDark} isLoading={isLoading} />
        <RoleBreakdownPanel users={users} isDark={isDark} isLoading={isLoading} />
        <SurveyStatusPanel surveys={surveys} isDark={isDark} isLoading={isLoading} />
        <SubjectsLoadPanel content={content} isDark={isDark} isLoading={isLoading} />
        <LatestAnnouncementsPanel
          announcements={latestAnnouncements}
          isDark={isDark}
          isLoading={isLoading}
        />
        <QuickActionsPanel actions={adminQuickActions} isDark={isDark} />
      </div>
    </div>
  );
}
