import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useErrorMessage } from "../../../../shared/i18n/useErrorMessage";
import {
  useGetSemestersQuery,
  useGetYearsQuery,
} from "../../academic/api/academicApi";
import {
  useCloseSurveyFormMutation,
  useCreateSurveyFormMutation,
  useGetSurveyFormsQuery,
  useOpenSurveyFormMutation,
} from "../api/surveysApi";
import type { SurveyForm, SurveyFormFilter, SurveyFormValues } from "../types";
import { getRefId } from "../utils/survey";

/** الإجراء المطلوب تأكيده قبل تنفيذه */
export interface PendingAction {
  type: "open" | "close";
  form: SurveyForm;
}

/**
 * إدارة فورمات الاستبيان للأدمن:
 * إنشاء مسودة → فتحها للطلاب → إغلاقها نهائياً، مع تصفح الردود.
 */
export function useSurveyFormsManager() {
  const { t } = useTranslation("admin");
  const errorMessage = useErrorMessage();
  const [filter, setFilter] = useState<SurveyFormFilter>("all");
  const [search, setSearch] = useState("");
  const [isCreating, setCreating] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [openedFormId, setOpenedFormId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formsQuery = useGetSurveyFormsQuery();
  const { data: years = [], isLoading: yearsLoading } = useGetYearsQuery();
  const { data: semesters = [], isLoading: semestersLoading } =
    useGetSemestersQuery();

  const [createForm, createState] = useCreateSurveyFormMutation();
  const [openForm, openState] = useOpenSurveyFormMutation();
  const [closeForm, closeState] = useCloseSurveyFormMutation();

  /** مرجع ثابت حتى لا تُعاد كل الـ memos عند كل render */
  const forms = useMemo(() => formsQuery.data ?? [], [formsQuery.data]);

  /**
   * أسماء السنوات/الفصول قد تغيب من الفورم (الباك يرجّعها null أحياناً)
   * فنعوّضها من قوائم الهيكل الأكاديمي عبر الـ id.
   */
  const yearNameById = useMemo(
    () => new Map(years.map((year) => [year._id, year.name])),
    [years],
  );
  const semesterNameById = useMemo(
    () => new Map(semesters.map((semester) => [semester._id, semester.name])),
    [semesters],
  );

  const describeForm = useMemo(
    () => (form: SurveyForm) => {
      const yearId = getRefId(form.yearId);
      const semesterId = getRefId(form.semesterId);
      const yearRef = typeof form.yearId === "object" ? form.yearId : null;
      const semesterRef =
        typeof form.semesterId === "object" ? form.semesterId : null;

      return {
        yearId,
        semesterId,
        yearName:
          yearRef?.name ?? yearNameById.get(yearId) ?? t("surveys.unknownYear"),
        semesterName:
          semesterRef?.name ??
          semesterNameById.get(semesterId) ??
          t("surveys.unknownSemester"),
      };
    },
    [yearNameById, semesterNameById, t],
  );

  const visibleForms = useMemo(() => {
    const term = search.trim().toLowerCase();

    return forms
      .filter((form) => filter === "all" || form.status === filter)
      .filter((form) => {
        if (!term) return true;
        const { yearName, semesterName } = describeForm(form);
        return `${yearName} ${semesterName} ${form.academicYear}`
          .toLowerCase()
          .includes(term);
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [forms, filter, search, describeForm]);

  const counts = useMemo(
    () => ({
      all: forms.length,
      draft: forms.filter((form) => form.status === "draft").length,
      open: forms.filter((form) => form.status === "open").length,
      closed: forms.filter((form) => form.status === "closed").length,
    }),
    [forms],
  );

  /** الفورم موجود مسبقاً لنفس السنة والفصل والسنة الأكاديمية؟ */
  const findDuplicate = (values: SurveyFormValues): SurveyForm | undefined =>
    forms.find(
      (form) =>
        getRefId(form.yearId) === values.yearId &&
        getRefId(form.semesterId) === values.semesterId &&
        form.academicYear === values.academicYear.trim(),
    );

  const openedForm = forms.find((form) => form._id === openedFormId) ?? null;

  // ── الإجراءات ───────────────────────────
  const startCreate = () => {
    setSuccessMessage("");
    createState.reset();
    setCreating(true);
  };

  const cancelCreate = () => {
    setCreating(false);
    createState.reset();
  };

  const submitCreate = async (values: SurveyFormValues) => {
    try {
      await createForm({
        yearId: values.yearId,
        semesterId: values.semesterId,
        academicYear: values.academicYear.trim(),
      }).unwrap();
      setCreating(false);
      setSuccessMessage(t("surveys.messages.created"));
    } catch {
      // الخطأ معروض داخل النافذة عبر createError
    }
  };

  const askOpen = (form: SurveyForm) => {
    openState.reset();
    setPendingAction({ type: "open", form });
  };

  const askClose = (form: SurveyForm) => {
    closeState.reset();
    setPendingAction({ type: "close", form });
  };

  const cancelAction = () => setPendingAction(null);

  const confirmAction = async () => {
    if (!pendingAction) return;
    const { type, form } = pendingAction;

    try {
      if (type === "open") {
        await openForm(form._id).unwrap();
        setSuccessMessage(t("surveys.messages.opened"));
      } else {
        await closeForm(form._id).unwrap();
        setSuccessMessage(t("surveys.messages.closed"));
      }
      setPendingAction(null);
    } catch {
      // الخطأ معروض داخل نافذة التأكيد
    }
  };

  const viewResponses = (form: SurveyForm) => {
    setSuccessMessage("");
    setOpenedFormId(form._id);
  };

  const closeResponses = () => setOpenedFormId("");

  return {
    // البيانات
    forms,
    visibleForms,
    counts,
    years,
    semesters,
    openedForm,
    describeForm,
    findDuplicate,

    // الحالة
    isLoading: formsQuery.isLoading,
    isFetching: formsQuery.isFetching,
    listError: formsQuery.isError ? errorMessage(formsQuery.error) : "",
    yearsLoading,
    semestersLoading,
    filter,
    search,
    isCreating,
    isSubmitting: createState.isLoading,
    createError: createState.error ? errorMessage(createState.error) : "",
    pendingAction,
    isActionRunning: openState.isLoading || closeState.isLoading,
    actionError: openState.error
      ? errorMessage(openState.error)
      : closeState.error
        ? errorMessage(closeState.error)
        : "",
    successMessage,

    // الإجراءات
    setFilter,
    setSearch,
    startCreate,
    cancelCreate,
    submitCreate,
    askOpen,
    askClose,
    cancelAction,
    confirmAction,
    viewResponses,
    closeResponses,
    refetch: formsQuery.refetch,
    dismissSuccess: () => setSuccessMessage(""),
  };
}
