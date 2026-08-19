import {
  AlertCircle,
  BookOpen,
  CalendarClock,
  CheckSquare,
  LayoutDashboard,
  Megaphone,
} from "lucide-react";
import { motion } from "motion/react";
import DashboardHeader from "../../../../shared/components/Dashboard/DashboardHeader";
import QuickActionsPanel from "../../../../shared/components/Dashboard/QuickActionsPanel";
import StatTile from "../../../../shared/components/StatTile/StatTile";
import { useIsDark } from "../../../../shared/hooks/useIsDark";
import { errorAlertClass } from "../../../../shared/utils/theme";
import { greetingByHour } from "../../../../shared/utils/datetime";
import FocusTimerCard from "../../components/FocusTimerCard";
import { useUserDashboard } from "../hooks/useUserDashboard";
import { userQuickActions } from "../dashboard.config";
import SurveyCallout from "../components/SurveyCallout";
import TasksProgressPanel from "../components/TasksProgressPanel";
import UpcomingDeadlinesPanel from "../components/UpcomingDeadlinesPanel";
import LatestLecturesPanel from "../components/LatestLecturesPanel";
import AnnouncementsPanel from "../components/AnnouncementsPanel";

/**
 * داشبورد الطالب: ما الذي يحتاج انتباهه اليوم.
 * الترتيب: نداء عاجل (استبيان) ← أرقام ← تقدّم + تركيز ← مواعيد ومحتوى.
 */
export default function UserDashboardPage() {
  const isDark = useIsDark();
  const {
    studentName,
    yearName,
    tasks,
    upcoming,
    latestLectures,
    announcements,
    survey,
    isLoading,
    isFetching,
    isError,
    refresh,
  } = useUserDashboard();

  const firstName = studentName.split(" ")[0] || "بك";
  const subtitle = yearName
    ? `${yearName} — إليك ملخّص يومك`
    : "إليك ملخّص يومك على المنصّة";

  return (
    <div className="flex flex-col gap-5" dir="rtl">
      <DashboardHeader
        icon={LayoutDashboard}
        title={`${greetingByHour()}، ${firstName}`}
        subtitle={subtitle}
        isDark={isDark}
        isFetching={isFetching}
        onRefresh={refresh}
      />

      <SurveyCallout survey={survey} isDark={isDark} />

      {isError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={errorAlertClass(isDark)}
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          تعذّر تحميل بعض البيانات. جرّب التحديث.
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          icon={CalendarClock}
          label="مواعيد قادمة"
          value={upcoming.length}
          hint={tasks.personalOverdue > 0 ? `${tasks.personalOverdue} متأخرة` : undefined}
          tone={tasks.personalOverdue > 0 ? "rose" : "amber"}
          isDark={isDark}
          isLoading={isLoading}
          to="/user/todo"
        />
        <StatTile
          icon={CheckSquare}
          label="مهام شخصية"
          value={tasks.personalTotal}
          hint={`${tasks.personalDone} منجزة`}
          tone="brand"
          isDark={isDark}
          isLoading={isLoading}
          to="/user/todo"
        />
        <StatTile
          icon={BookOpen}
          label="مهام أكاديمية مفتوحة"
          value={tasks.academicOpen}
          hint={`${tasks.academicTotal} إجمالاً`}
          tone="violet"
          isDark={isDark}
          isLoading={isLoading}
          to="/user/todo"
        />
        <StatTile
          icon={Megaphone}
          label="إعلانات دفعتك"
          value={announcements.length}
          tone="sky"
          isDark={isDark}
          isLoading={isLoading}
          to="/user/announcements"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TasksProgressPanel tasks={tasks} isDark={isDark} isLoading={isLoading} />
        </div>
        <FocusTimerCard isDark={isDark} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <UpcomingDeadlinesPanel items={upcoming} isDark={isDark} isLoading={isLoading} />
        <LatestLecturesPanel
          lectures={latestLectures}
          isDark={isDark}
          isLoading={isLoading}
        />
        <AnnouncementsPanel
          announcements={announcements}
          isDark={isDark}
          isLoading={isLoading}
        />
      </div>

      <QuickActionsPanel actions={userQuickActions} isDark={isDark} />
    </div>
  );
}
