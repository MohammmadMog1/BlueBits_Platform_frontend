import { useCallback, useMemo } from "react";
import { useGetUsersQuery } from "../../../users/api/usersApiSlice";
import { useGetSubjectsQuery } from "../../subjects/api/subjectsApi";
import { useGetYearsQuery } from "../../academic/api/academicApi";
import { useGetAcademicTasksQuery } from "../../tasks/api/academicTasksApi";
import { useGetAnnouncementsQuery } from "../../announcements/api/announcementsApi";
import { useGetSurveyFormsQuery } from "../../surveys/api/surveysApi";
import { USER_ROLES, type UserRole } from "../../../users/types";
import { useNow } from "../../../../shared/hooks/useNow";
import { useLecturesOverview } from "./useLecturesOverview";
import type {
  AdminDashboardState,
  RoleBreakdownItem,
  SubjectLoadItem,
} from "../types";

const ROLE_LABELS: Record<UserRole, string> = {
  USER: "طالب",
  DOCTOR: "دكتور",
  LECTURER: "محاضر",
  BLUE: "فريق بلو",
  ADMIN: "أدمن",
  SUPER_ADMIN: "سوبر أدمن",
};

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const CLOSING_SOON_LIMIT = 5;
const TOP_SUBJECTS_LIMIT = 5;
const LATEST_ANNOUNCEMENTS_LIMIT = 4;

const percent = (part: number, whole: number): number =>
  whole > 0 ? Math.round((part / whole) * 100) : 0;

/**
 * مصدر واحد لكل أرقام داشبورد الأدمن.
 * يعتمد على نفس الـ endpoints المستخدمة في صفحات الإدارة، فكاش RTK Query
 * يمنع تكرار الطلبات عند التنقّل بين الداشبورد وتلك الصفحات.
 */
export function useAdminDashboard(): AdminDashboardState {
  const now = useNow();

  const {
    data: usersData,
    isLoading: usersLoading,
    isFetching: usersFetching,
    isError: usersIsError,
    refetch: refetchUsers,
  } = useGetUsersQuery();

  const {
    data: subjectsData,
    isLoading: subjectsLoading,
    isFetching: subjectsFetching,
    isError: subjectsIsError,
    refetch: refetchSubjects,
  } = useGetSubjectsQuery();

  const {
    data: yearsData,
    isFetching: yearsFetching,
    refetch: refetchYears,
  } = useGetYearsQuery();

  const {
    data: tasksData,
    isLoading: tasksLoading,
    isFetching: tasksFetching,
    isError: tasksIsError,
    refetch: refetchTasks,
  } = useGetAcademicTasksQuery();

  const {
    data: announcementsData,
    isFetching: announcementsFetching,
    isError: announcementsIsError,
    refetch: refetchAnnouncements,
  } = useGetAnnouncementsQuery();

  const {
    data: surveyFormsData,
    isFetching: surveysFetching,
    isError: surveysIsError,
    refetch: refetchSurveys,
  } = useGetSurveyFormsQuery();

  const {
    stats: lectureStats,
    isLoading: lecturesLoading,
    isFetching: lecturesFetching,
    refresh: refreshLectures,
  } = useLecturesOverview();

  const users = useMemo(() => {
    const list = usersData ?? [];
    const total = list.length;
    const verified = list.filter((user) => user.isVerified).length;
    const weekAgo = now - WEEK_MS;

    const counts = list.reduce<Partial<Record<UserRole, number>>>((acc, user) => {
      acc[user.role] = (acc[user.role] ?? 0) + 1;
      return acc;
    }, {});

    const breakdown: RoleBreakdownItem[] = USER_ROLES.map((role) => ({
      role,
      label: ROLE_LABELS[role],
      count: counts[role] ?? 0,
      percentage: percent(counts[role] ?? 0, total),
    }))
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count);

    return {
      total,
      verified,
      unverified: total - verified,
      verifiedRate: percent(verified, total),
      joinedLastWeek: list.filter(
        (user) => new Date(user.createdAt).getTime() >= weekAgo,
      ).length,
      breakdown,
    };
  }, [usersData, now]);

  const content = useMemo(() => {
    const totals = lectureStats.reduce(
      (acc, item) => {
        acc.lectures += item.totalLectures ?? 0;
        acc.theoretical += item.theoreticalCount ?? 0;
        acc.practical += item.practicalCount ?? 0;
        return acc;
      },
      { lectures: 0, theoretical: 0, practical: 0 },
    );

    const sorted = [...lectureStats].sort(
      (a, b) => (b.totalLectures ?? 0) - (a.totalLectures ?? 0),
    );
    const max = sorted[0]?.totalLectures ?? 0;

    const topSubjects: SubjectLoadItem[] = sorted
      .slice(0, TOP_SUBJECTS_LIMIT)
      .map((item) => ({
        subjectId: item.subjectId,
        subjectName: item.subjectName,
        totalLectures: item.totalLectures ?? 0,
        theoreticalCount: item.theoreticalCount ?? 0,
        practicalCount: item.practicalCount ?? 0,
        percentage: percent(item.totalLectures ?? 0, max),
      }));

    return {
      subjects: subjectsData?.length ?? 0,
      years: yearsData?.length ?? 0,
      lectures: totals.lectures,
      theoretical: totals.theoretical,
      practical: totals.practical,
      topSubjects,
    };
  }, [lectureStats, subjectsData, yearsData]);

  const tasks = useMemo(() => {
    const list = tasksData ?? [];
    const open = list.filter((task) => task.status === "open");

    return {
      total: list.length,
      open: open.length,
      closed: list.length - open.length,
      closingSoon: [...open]
        .sort(
          (a, b) =>
            new Date(a.closesAt).getTime() - new Date(b.closesAt).getTime(),
        )
        .slice(0, CLOSING_SOON_LIMIT),
    };
  }, [tasksData]);

  const surveys = useMemo(() => {
    const list = surveyFormsData ?? [];
    const openForms = list.filter((form) => form.status === "open");

    return {
      total: list.length,
      open: openForms.length,
      draft: list.filter((form) => form.status === "draft").length,
      closed: list.filter((form) => form.status === "closed").length,
      activeForm:
        [...openForms].sort(
          (a, b) =>
            new Date(b.openedAt ?? b.createdAt).getTime() -
            new Date(a.openedAt ?? a.createdAt).getTime(),
        )[0] ?? null,
    };
  }, [surveyFormsData]);

  const latestAnnouncements = useMemo(() => {
    return [...(announcementsData ?? [])]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, LATEST_ANNOUNCEMENTS_LIMIT);
  }, [announcementsData]);

  const refresh = useCallback(() => {
    refetchUsers();
    refetchSubjects();
    refetchYears();
    refetchTasks();
    refetchAnnouncements();
    refetchSurveys();
    refreshLectures();
  }, [
    refetchUsers,
    refetchSubjects,
    refetchYears,
    refetchTasks,
    refetchAnnouncements,
    refetchSurveys,
    refreshLectures,
  ]);

  return {
    users,
    content,
    tasks,
    surveys,
    latestAnnouncements,
    isLoading: usersLoading || subjectsLoading || tasksLoading || lecturesLoading,
    isFetching:
      usersFetching ||
      subjectsFetching ||
      yearsFetching ||
      tasksFetching ||
      announcementsFetching ||
      surveysFetching ||
      lecturesFetching,
    isError:
      usersIsError ||
      subjectsIsError ||
      tasksIsError ||
      announcementsIsError ||
      surveysIsError,
    refresh,
  };
}
