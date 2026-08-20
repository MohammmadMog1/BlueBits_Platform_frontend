import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../app/store/hooks";
import { useErrorMessage } from "../../../../shared/i18n/useErrorMessage";
import { useGetSubjectsQuery } from "../../../admin/subjects/api/subjectsApi";
import {
  useGetActiveSurveyFormQuery,
  useGetMyLastResponseQuery,
  useGetMyResponseForFormQuery,
  useSubmitSurveyResponseMutation,
} from "../../../admin/surveys/api/surveysApi";
import type { SubjectAnswerRow } from "../../../admin/surveys/types";
import {
  DEFAULT_DAYS_BEFORE,
  DEFAULT_DIFFICULTY,
  MAX_DAYS_BEFORE,
  MAX_DIFFICULTY,
  MIN_DAYS_BEFORE,
  MIN_DIFFICULTY,
  clamp,
  getRefId,
  getRefName,
} from "../../../admin/surveys/utils/survey";

/** حالة الصف في النموذج: مُختار أم لا + قيم الإجابة */
export interface AnswerRowState extends SubjectAnswerRow {
  isSelected: boolean;
  /** ترتيب الاختيار – لعرض لوحة الإعدادات بترتيب نقر الطالب */
  pickedAt: number;
}

/** تبويبات لوحة اختيار المواد */
export type PickerTab = "all" | "selected" | "carrying";

/**
 * تعبئة استبيان الجدولة للطالب:
 * الفورم المفتوح لسنته ← مواد سنته في نفس الفصل ← إرسال الإجابة.
 */
export function useSurveyResponse() {
  const { t } = useTranslation("survey");
  const errorMessage = useErrorMessage();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [rows, setRows] = useState<AnswerRowState[]>([]);
  /** بصمة المواد التي بُنيت منها الصفوف – لإعادة البناء عند تغيّرها فقط */
  const [seededKey, setSeededKey] = useState("");
  /** عدّاد متزايد يعطي كل اختيار جديد ترتيبه */
  const [pickSeq, setPickSeq] = useState(0);
  const [tab, setTab] = useState<PickerTab>("all");
  const [search, setSearch] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isConfirming, setConfirming] = useState(false);

  const activeQuery = useGetActiveSurveyFormQuery();
  const lastResponseQuery = useGetMyLastResponseQuery();

  const form = activeQuery.data?.form ?? null;
  const alreadySubmitted = activeQuery.data?.alreadySubmitted ?? false;

  /** الفورم يحمل سنته وفصله؛ نسقط على سنة المستخدم إن رجّعها الباك null */
  const yearId = getRefId(form?.yearId ?? null) || (currentUser?.yearId ?? "");
  const semesterId = getRefId(form?.semesterId ?? null);

  const subjectsQuery = useGetSubjectsQuery(
    { yearId, semesterId },
    { skip: !yearId || !semesterId },
  );

  const myResponseQuery = useGetMyResponseForFormQuery(form?._id ?? "", {
    skip: !form?._id || !alreadySubmitted,
  });

  const [submit, submitState] = useSubmitSurveyResponseMutation();

  const subjects = useMemo(() => subjectsQuery.data ?? [], [subjectsQuery.data]);

  const subjectsKey = useMemo(
    () => subjects.map((subject) => subject._id).join("|"),
    [subjects],
  );

  /**
   * نبني الصفوف مرة واحدة لكل مجموعة مواد – ضبط أثناء الـ render بدل effect
   * حتى لا يومض النموذج فارغاً. كل المواد مُختارة افتراضياً لأن الطالب
   * عادة يتقدّم لكل مواد فصله، ويزيل ما لا يخصّه.
   */
  if (seededKey !== subjectsKey) {
    setSeededKey(subjectsKey);
    setPickSeq(subjects.length);
    setRows(
      subjects.map((subject, index) => ({
        subjectId: subject._id,
        subjectName: subject.name,
        isSelected: true,
        isCarrying: false,
        preferredDaysBefore: DEFAULT_DAYS_BEFORE,
        difficultyRating: DEFAULT_DIFFICULTY,
        pickedAt: index,
      })),
    );
  }

  /** المواد المختارة مرتّبة بترتيب اختيارها – هي ما سيُرسَل */
  const selectedRows = useMemo(
    () =>
      rows
        .filter((row) => row.isSelected)
        .sort((a, b) => a.pickedAt - b.pickedAt),
    [rows],
  );

  const carryingCount = useMemo(
    () => selectedRows.filter((row) => row.isCarrying).length,
    [selectedRows],
  );

  /** ما يعرضه اللوح الأيسر بعد التبويب والبحث */
  const visibleRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (tab === "selected" && !row.isSelected) return false;
      if (tab === "carrying" && !row.isCarrying) return false;
      if (term && !row.subjectName.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [rows, tab, search]);

  // ── تعديل الصفوف ────────────────────────
  const patchRow = (subjectId: string, patch: Partial<AnswerRowState>) =>
    setRows((current) =>
      current.map((row) =>
        row.subjectId === subjectId ? { ...row, ...patch } : row,
      ),
    );

  const toggleSubject = (subjectId: string) => {
    const nextSeq = pickSeq + 1;
    setPickSeq(nextSeq);
    setRows((current) =>
      current.map((row) =>
        row.subjectId === subjectId
          ? {
              ...row,
              isSelected: !row.isSelected,
              // إلغاء الحملة تلقائياً عند استبعاد المادة حتى لا تبقى معلّقة
              isCarrying: row.isSelected ? false : row.isCarrying,
              pickedAt: row.isSelected ? row.pickedAt : nextSeq,
            }
          : row,
      ),
    );
  };

  /** تفعيل الحملة يضمّن المادة تلقائياً – لا معنى لحملة غير مُختارة */
  const toggleCarrying = (subjectId: string) => {
    const nextSeq = pickSeq + 1;
    setPickSeq(nextSeq);
    setRows((current) =>
      current.map((row) =>
        row.subjectId === subjectId
          ? {
              ...row,
              isCarrying: !row.isCarrying,
              isSelected: row.isCarrying ? row.isSelected : true,
              pickedAt: row.isSelected ? row.pickedAt : nextSeq,
            }
          : row,
      ),
    );
  };

  const setDaysBefore = (subjectId: string, value: number) =>
    patchRow(subjectId, {
      preferredDaysBefore: clamp(value, MIN_DAYS_BEFORE, MAX_DAYS_BEFORE),
    });

  const setDifficulty = (subjectId: string, value: number) =>
    patchRow(subjectId, {
      difficultyRating: clamp(value, MIN_DIFFICULTY, MAX_DIFFICULTY),
    });

  const selectAll = () =>
    setRows((current) => current.map((row) => ({ ...row, isSelected: true })));

  const clearAll = () =>
    setRows((current) =>
      current.map((row) => ({ ...row, isSelected: false, isCarrying: false })),
    );

  // ── الإرسال ─────────────────────────────
  const confirmSubmit = async () => {
    if (!form || selectedRows.length === 0) return;

    try {
      await submit({
        formId: form._id,
        subjectResponses: selectedRows.map((row) => ({
          subjectId: row.subjectId,
          isCarrying: row.isCarrying,
          preferredDaysBefore: row.preferredDaysBefore,
          difficultyRating: row.difficultyRating,
        })),
      }).unwrap();

      setConfirming(false);
      setSuccessMessage(t("success.title"));
    } catch {
      // الخطأ معروض داخل نافذة التأكيد
    }
  };

  return {
    // البيانات
    form,
    alreadySubmitted,
    rows,
    visibleRows,
    selectedRows,
    selectedCount: selectedRows.length,
    carryingCount,
    subjectsCount: subjects.length,
    myResponse: myResponseQuery.data ?? null,
    lastResponse: lastResponseQuery.data ?? null,
    yearName: getRefName(form?.yearId ?? null, t("defaults.yourYear")),
    semesterName: getRefName(
      form?.semesterId ?? null,
      t("defaults.currentSemester"),
    ),

    // الحالة
    isLoading: activeQuery.isLoading,
    isFetching: activeQuery.isFetching,
    activeError: activeQuery.isError ? errorMessage(activeQuery.error) : "",
    subjectsLoading: subjectsQuery.isLoading || subjectsQuery.isFetching,
    subjectsError: subjectsQuery.isError ? errorMessage(subjectsQuery.error) : "",
    myResponseLoading: myResponseQuery.isLoading,
    lastResponseLoading: lastResponseQuery.isLoading,
    isSubmitting: submitState.isLoading,
    submitError: submitState.error ? errorMessage(submitState.error) : "",
    successMessage,
    isConfirming,
    tab,
    search,
    /** لا يمكن الإرسال بلا مواد مُختارة */
    canSubmit: Boolean(form) && selectedRows.length > 0,

    // الإجراءات
    setTab,
    setSearch,
    toggleSubject,
    toggleCarrying,
    setDaysBefore,
    setDifficulty,
    selectAll,
    clearAll,
    askSubmit: () => {
      submitState.reset();
      setConfirming(true);
    },
    cancelSubmit: () => setConfirming(false),
    confirmSubmit,
    dismissSuccess: () => setSuccessMessage(""),
    refetch: () => {
      void activeQuery.refetch();
      void lastResponseQuery.refetch();
    },
  };
}
