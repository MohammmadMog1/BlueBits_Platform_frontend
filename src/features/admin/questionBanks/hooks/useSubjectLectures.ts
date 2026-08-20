import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchLecturesByFilter } from "../../lectures/api/lecturesService";
import type { LecturePopulated, LectureType } from "../../lectures/types";

const LECTURE_TYPES: LectureType[] = ["theoretical", "practical"];

interface LecturesCache {
  subjectId: string;
  token: number;
  lectures: LecturePopulated[];
  /** `true` عند الفشل – النصّ المترجَم يُشتقّ عند العرض لا هنا */
  failed: boolean;
}

const EMPTY_CACHE: LecturesCache = {
  subjectId: "",
  token: -1,
  lectures: [],
  failed: false,
};

export interface UseSubjectLecturesReturn {
  lectures: LecturePopulated[];
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * يجلب محاضرات المادة (نظري + عملي) لاستخدامها عند إنشاء بنك أسئلة،
 * لأن الباك يربط البنك بالـ lectureId.
 *
 * حالة التحميل مُشتقّة من الكاش (لا setState داخل الـ effect):
 * ما دام الكاش لا يطابق المادة/الطلب الحالي فنحن في حالة تحميل.
 */
export function useSubjectLectures(subjectId: string): UseSubjectLecturesReturn {
  const { t } = useTranslation("admin");
  const [cache, setCache] = useState<LecturesCache>(EMPTY_CACHE);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!subjectId) return;

    let cancelled = false;

    Promise.all(
      LECTURE_TYPES.map((type) =>
        fetchLecturesByFilter({ subjectId, type }).catch(
          () => [] as LecturePopulated[],
        ),
      ),
    )
      .then((results) => {
        if (cancelled) return;
        const merged = new Map<string, LecturePopulated>();
        results.flat().forEach((lecture) => merged.set(lecture._id, lecture));
        setCache({
          subjectId,
          token: reloadToken,
          lectures: [...merged.values()],
          failed: false,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setCache({
          subjectId,
          token: reloadToken,
          lectures: [],
          failed: true,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [subjectId, reloadToken]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  return useMemo(() => {
    // نعرض بيانات المادة الحالية فقط حتى لا تظهر نتائج مادة سابقة
    const isCurrent =
      Boolean(subjectId) &&
      cache.subjectId === subjectId &&
      cache.token === reloadToken;

    return {
      lectures: isCurrent ? cache.lectures : [],
      isLoading: Boolean(subjectId) && !isCurrent,
      error:
        isCurrent && cache.failed
          ? t("banks.actionErrors.lecturesFailed")
          : null,
      reload,
    };
  }, [cache, reloadToken, reload, subjectId, t]);
}
