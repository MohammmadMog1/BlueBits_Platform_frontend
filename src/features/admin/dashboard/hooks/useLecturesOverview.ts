import { useCallback, useEffect, useState } from "react";
import { getLecturesCountPerSubject } from "../../lectures/api/lecturesService";
import type { LectureSubjectStats } from "../../lectures/types";

/**
 * إحصاءات المحاضرات لكل مادة (`/lectures/stats/per-subject`).
 * ميزة المحاضرات تعتمد axios وليس RTK Query، لذا نغلّف الطلب هنا
 * بنفس أسلوب `useLectureManager` مع إتاحة إعادة التحميل يدوياً.
 */
export function useLecturesOverview() {
  const [stats, setStats] = useState<LectureSubjectStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [isError, setIsError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getLecturesCountPerSubject()
      .then((data) => {
        if (cancelled) return;
        setStats(Array.isArray(data) ? data : []);
        setIsError(false);
      })
      .catch(() => {
        if (cancelled) return;
        setStats([]);
        setIsError(true);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
        setIsFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const refresh = useCallback(() => {
    setIsFetching(true);
    setReloadToken((token) => token + 1);
  }, []);

  return { stats, isLoading, isFetching, isError, refresh };
}
