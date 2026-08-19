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
    <div className="flex flex-col gap-5" dir="rtl">
      <DashboardHeader
        icon={LayoutDashboard}
        title="لوحة الإدارة"
        subtitle="نظرة عامة على المستخدمين والمحتوى والمهام"
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
          تعذّر تحميل بعض البيانات. الأرقام المعروضة قد تكون ناقصة — جرّب التحديث.
        </motion.div>
      )}

      {/* الأرقام السريعة */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <StatTile
          icon={Users}
          label="المستخدمون"
          value={users.total}
          hint={`+${users.joinedLastWeek} هذا الأسبوع`}
          tone="brand"
          isDark={isDark}
          isLoading={isLoading}
          to="/admin/users"
        />
        <StatTile
          icon={UserCheck}
          label="حسابات مفعّلة"
          value={`${users.verifiedRate}%`}
          hint={`${users.unverified} بانتظار التفعيل`}
          tone="emerald"
          isDark={isDark}
          isLoading={isLoading}
          to="/admin/users"
        />
        <StatTile
          icon={FileText}
          label="المحاضرات"
          value={content.lectures}
          hint={`${content.theoretical} نظري / ${content.practical} عملي`}
          tone="violet"
          isDark={isDark}
          isLoading={isLoading}
          to="/admin/lectures"
        />
        <StatTile
          icon={BookMarked}
          label="المواد"
          value={content.subjects}
          tone="sky"
          isDark={isDark}
          isLoading={isLoading}
          to="/admin/subjects"
        />
        <StatTile
          icon={GraduationCap}
          label="السنوات الدراسية"
          value={content.years}
          tone="rose"
          isDark={isDark}
          isLoading={isLoading}
          to="/admin/academic"
        />
        <StatTile
          icon={ClipboardList}
          label="مهام مفتوحة"
          value={tasks.open}
          hint={`${tasks.total} إجمالاً`}
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
