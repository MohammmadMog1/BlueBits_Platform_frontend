import { useCallback, useMemo, useState } from "react";
import {
  useGetSemestersQuery,
  useGetYearsQuery,
} from "../../academic/api/academicApi";
import { useGetSubjectsQuery } from "../../subjects/api/subjectsApi";
import {
  useDeleteBankMutation,
  useDeleteQuestionMutation,
  useGetBankQuery,
  useGetBanksBySubjectQuery,
  usePublishBankMutation,
  useUnpublishBankMutation,
  useUpdateQuestionMutation,
} from "../api/questionBanksApi";
import { getApiErrorMessage, getLectureTitle } from "../utils/bank";
import type { Question, QuestionBank, UpdateQuestionPayload } from "../types";

export type BankStep = "year" | "semester" | "subject" | "banks" | "bank";

export interface UseQuestionBankManagerReturn {
  // Data
  years: { _id: string; name: string }[];
  semesters: { _id: string; name: string }[];
  subjects: { _id: string; name: string }[];
  banks: QuestionBank[];
  bank: QuestionBank | null;
  questions: Question[];
  // Loading
  yearsLoading: boolean;
  semestersLoading: boolean;
  subjectsLoading: boolean;
  banksLoading: boolean;
  bankLoading: boolean;
  isMutating: boolean;
  // Errors
  actionError: string | null;
  clearActionError: () => void;
  // Navigation state
  step: BankStep;
  selectedYearId: string;
  selectedSemesterId: string;
  selectedSubjectId: string;
  selectedBankId: string;
  search: string;
  setSearch: (value: string) => void;
  selectYear: (yearId: string) => void;
  selectSemester: (semesterId: string) => void;
  selectSubject: (subjectId: string) => void;
  openBank: (bankId: string) => void;
  goBack: () => void;
  navTo: (target: BankStep) => void;
  // Actions
  handlePublish: (bankId: string) => Promise<void>;
  handleUnpublish: (bankId: string) => Promise<void>;
  handleDeleteBank: (bankId: string) => Promise<void>;
  handleDeleteQuestion: (questionId: string) => Promise<void>;
  handleUpdateQuestion: (payload: UpdateQuestionPayload) => Promise<boolean>;
  // Upload modal
  showUpload: boolean;
  openUpload: () => void;
  closeUpload: () => void;
  // Stats
  stats: { label: string; value: number | string; color: string }[];
}

export function useQuestionBankManager(): UseQuestionBankManagerReturn {
  const [step, setStep] = useState<BankStep>("year");
  const [selectedYearId, setSelectedYearId] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedBankId, setSelectedBankId] = useState("");
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: years = [], isLoading: yearsLoading } = useGetYearsQuery();
  const { data: semesters = [], isLoading: semestersLoading } =
    useGetSemestersQuery();

  const { data: subjects = [], isLoading: subjectsLoading } = useGetSubjectsQuery(
    { yearId: selectedYearId, semesterId: selectedSemesterId },
    { skip: !selectedYearId || !selectedSemesterId },
  );

  const { data: banks = [], isFetching: banksLoading } = useGetBanksBySubjectQuery(
    selectedSubjectId,
    { skip: !selectedSubjectId },
  );

  const { data: bankDetail, isFetching: bankLoading } = useGetBankQuery(
    selectedBankId,
    { skip: !selectedBankId },
  );

  const [publishBank, { isLoading: publishing }] = usePublishBankMutation();
  const [unpublishBank, { isLoading: unpublishing }] = useUnpublishBankMutation();
  const [deleteBank, { isLoading: deletingBank }] = useDeleteBankMutation();
  const [deleteQuestion, { isLoading: deletingQuestion }] =
    useDeleteQuestionMutation();
  const [updateQuestion, { isLoading: updatingQuestion }] =
    useUpdateQuestionMutation();

  const isMutating =
    publishing ||
    unpublishing ||
    deletingBank ||
    deletingQuestion ||
    updatingQuestion;

  // ── Filtered lists ───────────────────────
  const filteredBanks = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return banks;
    return banks.filter((bank) =>
      `${bank.title} ${getLectureTitle(bank)}`.toLowerCase().includes(term),
    );
  }, [banks, search]);

  const bank = bankDetail?.bank ?? null;

  const questions = useMemo(() => {
    const list = bankDetail?.questions ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter((question) =>
      question.questionText.toLowerCase().includes(term),
    );
  }, [bankDetail, search]);

  const stats = useMemo(() => {
    const publishedCount = banks.filter((item) => item.status === "published").length;
    const draftCount = banks.filter((item) => item.status === "draft").length;
    const totalQuestions = banks.reduce(
      (total, item) => total + (item.questionCount ?? 0),
      0,
    );

    return [
      { label: "Total Banks", value: banks.length, color: "#404293" },
      { label: "Published", value: publishedCount, color: "#059669" },
      { label: "Drafts", value: draftCount, color: "#F59E0B" },
      { label: "Total Questions", value: totalQuestions, color: "#2376BB" },
    ];
  }, [banks]);

  // ── Navigation ───────────────────────────
  const selectYear = useCallback((yearId: string) => {
    setSelectedYearId(yearId);
    setSelectedSemesterId("");
    setSelectedSubjectId("");
    setSelectedBankId("");
    setSearch("");
    setStep("semester");
  }, []);

  const selectSemester = useCallback((semesterId: string) => {
    setSelectedSemesterId(semesterId);
    setSelectedSubjectId("");
    setSelectedBankId("");
    setSearch("");
    setStep("subject");
  }, []);

  const selectSubject = useCallback((subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setSelectedBankId("");
    setSearch("");
    setStep("banks");
  }, []);

  const openBank = useCallback((bankId: string) => {
    setSelectedBankId(bankId);
    setSearch("");
    setStep("bank");
  }, []);

  const goBack = useCallback(() => {
    setSearch("");
    setActionError(null);
    if (step === "bank") {
      setSelectedBankId("");
      setStep("banks");
    } else if (step === "banks") setStep("subject");
    else if (step === "subject") setStep("semester");
    else if (step === "semester") setStep("year");
  }, [step]);

  const navTo = useCallback(
    (target: BankStep) => {
      setActionError(null);
      if (target === "year") setStep("year");
      else if (target === "semester" && selectedYearId) setStep("semester");
      else if (target === "subject" && selectedSemesterId) setStep("subject");
      else if (target === "banks" && selectedSubjectId) {
        setSelectedBankId("");
        setStep("banks");
      } else if (target === "bank" && selectedBankId) setStep("bank");
    },
    [selectedYearId, selectedSemesterId, selectedSubjectId, selectedBankId],
  );

  // ── Actions ──────────────────────────────
  const handlePublish = useCallback(
    async (bankId: string) => {
      setActionError(null);
      try {
        await publishBank(bankId).unwrap();
      } catch (error) {
        setActionError(getApiErrorMessage(error, "تعذّر نشر بنك الأسئلة."));
      }
    },
    [publishBank],
  );

  const handleUnpublish = useCallback(
    async (bankId: string) => {
      setActionError(null);
      try {
        await unpublishBank(bankId).unwrap();
      } catch (error) {
        setActionError(getApiErrorMessage(error, "تعذّر إلغاء نشر بنك الأسئلة."));
      }
    },
    [unpublishBank],
  );

  const handleDeleteBank = useCallback(
    async (bankId: string) => {
      setActionError(null);
      try {
        await deleteBank(bankId).unwrap();
        if (bankId === selectedBankId) {
          setSelectedBankId("");
          setStep("banks");
        }
      } catch (error) {
        setActionError(getApiErrorMessage(error, "تعذّر حذف بنك الأسئلة."));
      }
    },
    [deleteBank, selectedBankId],
  );

  const handleDeleteQuestion = useCallback(
    async (questionId: string) => {
      setActionError(null);
      try {
        await deleteQuestion({ questionId, bankId: selectedBankId }).unwrap();
      } catch (error) {
        setActionError(getApiErrorMessage(error, "تعذّر حذف السؤال."));
      }
    },
    [deleteQuestion, selectedBankId],
  );

  const handleUpdateQuestion = useCallback(
    async (payload: UpdateQuestionPayload) => {
      setActionError(null);
      try {
        await updateQuestion({ ...payload, bankId: selectedBankId }).unwrap();
        return true;
      } catch (error) {
        setActionError(getApiErrorMessage(error, "تعذّر تعديل السؤال."));
        return false;
      }
    },
    [updateQuestion, selectedBankId],
  );

  const clearActionError = useCallback(() => setActionError(null), []);
  const openUpload = useCallback(() => setShowUpload(true), []);
  const closeUpload = useCallback(() => setShowUpload(false), []);

  return {
    years,
    semesters,
    subjects,
    banks: filteredBanks,
    bank,
    questions,
    yearsLoading,
    semestersLoading,
    subjectsLoading,
    banksLoading,
    bankLoading,
    isMutating,
    actionError,
    clearActionError,
    step,
    selectedYearId,
    selectedSemesterId,
    selectedSubjectId,
    selectedBankId,
    search,
    setSearch,
    selectYear,
    selectSemester,
    selectSubject,
    openBank,
    goBack,
    navTo,
    handlePublish,
    handleUnpublish,
    handleDeleteBank,
    handleDeleteQuestion,
    handleUpdateQuestion,
    showUpload,
    openUpload,
    closeUpload,
    stats,
  };
}
