import { useCallback, useMemo, useState } from "react";
import {
  useGetSemestersQuery,
  useGetYearsQuery,
} from "../../../admin/academic/api/academicApi";
import { useGetSubjectsQuery } from "../../../admin/subjects/api/subjectsApi";
import { useGetBanksBySubjectQuery } from "../../../admin/questionBanks/api/questionBanksApi";
import { getLectureTitle } from "../../../admin/questionBanks/utils/bank";
import type { QuestionBank } from "../../../admin/questionBanks/types";

export type McqStep = "year" | "semester" | "subject" | "banks" | "quiz";

export interface UseMcqBrowserReturn {
  years: { _id: string; name: string }[];
  semesters: { _id: string; name: string }[];
  subjects: { _id: string; name: string }[];
  banks: QuestionBank[];
  /** عدد البنوك غير المنشورة في المادة – لتوضيح سبب الفراغ للطالب */
  unpublishedCount: number;
  yearsLoading: boolean;
  semestersLoading: boolean;
  subjectsLoading: boolean;
  banksLoading: boolean;
  step: McqStep;
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
  navTo: (target: McqStep) => void;
}

/**
 * تنقّل الطالب: سنة → فصل → مادة → بنوك الأسئلة المنشورة → حل البنك.
 */
export function useMcqBrowser(): UseMcqBrowserReturn {
  const [step, setStep] = useState<McqStep>("year");
  const [selectedYearId, setSelectedYearId] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedBankId, setSelectedBankId] = useState("");
  const [search, setSearch] = useState("");

  const { data: years = [], isLoading: yearsLoading } = useGetYearsQuery();
  const { data: semesters = [], isLoading: semestersLoading } =
    useGetSemestersQuery();

  const { data: subjects = [], isLoading: subjectsLoading } = useGetSubjectsQuery(
    { yearId: selectedYearId, semesterId: selectedSemesterId },
    { skip: !selectedYearId || !selectedSemesterId },
  );

  const { data: allBanks = [], isFetching: banksLoading } =
    useGetBanksBySubjectQuery(selectedSubjectId, { skip: !selectedSubjectId });

  // الطالب يشوف البنوك المنشورة فقط (الباك يرفض حل بنك غير منشور)
  const publishedBanks = useMemo(
    () => allBanks.filter((bank) => bank.status === "published"),
    [allBanks],
  );

  const banks = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return publishedBanks;
    return publishedBanks.filter((bank) =>
      `${bank.title} ${getLectureTitle(bank)}`.toLowerCase().includes(term),
    );
  }, [publishedBanks, search]);

  const unpublishedCount = allBanks.length - publishedBanks.length;

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
    setStep("quiz");
  }, []);

  const goBack = useCallback(() => {
    setSearch("");
    if (step === "quiz") {
      setSelectedBankId("");
      setStep("banks");
    } else if (step === "banks") setStep("subject");
    else if (step === "subject") setStep("semester");
    else if (step === "semester") setStep("year");
  }, [step]);

  const navTo = useCallback(
    (target: McqStep) => {
      if (target === "year") setStep("year");
      else if (target === "semester" && selectedYearId) setStep("semester");
      else if (target === "subject" && selectedSemesterId) setStep("subject");
      else if (target === "banks" && selectedSubjectId) {
        setSelectedBankId("");
        setStep("banks");
      } else if (target === "quiz" && selectedBankId) setStep("quiz");
    },
    [selectedYearId, selectedSemesterId, selectedSubjectId, selectedBankId],
  );

  return {
    years,
    semesters,
    subjects,
    banks,
    unpublishedCount,
    yearsLoading,
    semestersLoading,
    subjectsLoading,
    banksLoading,
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
  };
}
