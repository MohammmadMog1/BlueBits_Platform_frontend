import { useGetLecturesCountPerSubjectQuery } from "../../lectures/api/lecturesStatsApi";

/**
 * إحصاءات المحاضرات لكل مادة (`/lectures/stats/per-subject`).
 * تعتمد الآن على RTK Query، فالكاش المشترك يمنع إعادة تنفيذ الطلب
 * في كل مرة تُفتح فيها صفحة الداشبورد أو صفحة إدارة المحاضرات.
 */
export function useLecturesOverview() {
  const {
    data: stats = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetLecturesCountPerSubjectQuery();

  return { stats, isLoading, isFetching, isError, refresh: refetch };
}
