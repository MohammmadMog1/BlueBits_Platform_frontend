import { useGetAllLecturesQuery } from "../api/userLecturesApi";

/**
 * Shared by useLatestLectures and useRecentDownloads. يعتمد على RTK Query
 * فالكاش المشترك يمنع تكرار طلب "/lectures" عند التنقّل بين الداشبورد
 * وصفحة المحاضرات، أو عند تركيب أكثر من مكوّن يحتاج نفس البيانات دفعة واحدة.
 */
export function useAllLectures() {
  const { data: lectures = [], isLoading: loading } = useGetAllLecturesQuery();
  return { lectures, loading };
}
