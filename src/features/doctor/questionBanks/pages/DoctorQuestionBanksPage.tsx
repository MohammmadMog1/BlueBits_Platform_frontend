import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  BrainCircuit,
  FolderOpen,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  X,
} from "lucide-react";
import { useErrorMessage } from "../../../../shared/i18n/useErrorMessage";
import { useIsDark } from "../../../../shared/hooks/useIsDark";
import { useLanguage } from "../../../../shared/i18n/useLanguage";
import {
  cardClass,
  emptyBoxClass,
  errorAlertClass,
  faintClass,
  headingClass,
  iconButtonClass,
  mutedClass,
} from "../../../../shared/utils/theme";
import { BankCard } from "../../../admin/questionBanks/components/BankCard";
import { BankReviewPanel } from "../../../admin/questionBanks/components/BankReviewPanel";
import { getApiErrorMessage } from "../../../admin/questionBanks/utils/bank";
import type { QuestionBankPermissions } from "../../../admin/questionBanks/hooks/useQuestionBankPermissions";
import type { QuestionOption, QuestionType } from "../../../admin/questionBanks/types";
import {
  useDeleteQuestionMutation,
  useGetBankQuery,
  usePublishBankMutation,
  useUnpublishBankMutation,
  useUpdateQuestionMutation,
} from "../../../admin/questionBanks/api/questionBanksApi";
import { useDeleteBankMutation, useGetMyBanksQuery } from "../../api/doctorApi";
import { DoctorBankUploadModal } from "../components/DoctorBankUploadModal";

/** الدكتور يملك بنوكه بالكامل (السيرفر يفرض ذلك) — لا حاجة لتحقّق صلاحيات دقيقة */
const DOCTOR_BANK_PERMISSIONS: QuestionBankPermissions = {
  canCreate: true,
  canUpdateQuestion: true,
  canDeleteQuestion: true,
};

export default function DoctorQuestionBanksPage() {
  const { t } = useTranslation(["doctor", "admin", "common"]);
  const { isRTL } = useLanguage();
  const errorMessage = useErrorMessage();
  const isDark = useIsDark();

  const [search, setSearch] = useState("");
  const [selectedBankId, setSelectedBankId] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const banksQuery = useGetMyBanksQuery();
  const banks = useMemo(() => banksQuery.data ?? [], [banksQuery.data]);

  const filteredBanks = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return banks;
    return banks.filter((bank) => bank.title.toLowerCase().includes(term));
  }, [banks, search]);

  const stats = useMemo(() => {
    const published = banks.filter((bank) => bank.status === "published").length;
    const totalQuestions = banks.reduce((sum, bank) => sum + (bank.questionCount ?? 0), 0);
    return [
      { label: t("doctor:banks.stats.totalBanks"), value: banks.length, color: "#404293" },
      { label: t("doctor:banks.stats.published"), value: published, color: "#059669" },
      { label: t("doctor:banks.stats.drafts"), value: banks.length - published, color: "#F59E0B" },
      { label: t("doctor:banks.stats.totalQuestions"), value: totalQuestions, color: "#2376BB" },
    ];
  }, [banks, t]);

  const { data: bankDetail, isFetching: bankLoading } = useGetBankQuery(selectedBankId, {
    skip: !selectedBankId,
  });
  const bank = bankDetail?.bank ?? null;
  const questions = bankDetail?.questions ?? [];

  const [publishBank, { isLoading: publishing }] = usePublishBankMutation();
  const [unpublishBank, { isLoading: unpublishing }] = useUnpublishBankMutation();
  const [deleteQuestion, { isLoading: deletingQuestion }] = useDeleteQuestionMutation();
  const [updateQuestion, { isLoading: updatingQuestion }] = useUpdateQuestionMutation();
  const [deleteBank, { isLoading: deletingBank }] = useDeleteBankMutation();

  const isMutating = publishing || unpublishing || deletingQuestion || updatingQuestion || deletingBank;

  const openBank = (id: string) => {
    setActionError(null);
    setSelectedBankId(id);
  };

  const backToList = () => {
    setSelectedBankId("");
    setActionError(null);
    banksQuery.refetch();
  };

  const handlePublish = async (id: string) => {
    setActionError(null);
    try {
      await publishBank(id).unwrap();
    } catch (error) {
      setActionError(getApiErrorMessage(error) ?? t("admin:banks.actionErrors.publishFailed"));
    }
  };

  const handleUnpublish = async (id: string) => {
    setActionError(null);
    try {
      await unpublishBank(id).unwrap();
    } catch (error) {
      setActionError(getApiErrorMessage(error) ?? t("admin:banks.actionErrors.unpublishFailed"));
    }
  };

  const handleDeleteBank = async (id: string) => {
    setActionError(null);
    try {
      await deleteBank(id).unwrap();
      if (id === selectedBankId) setSelectedBankId("");
    } catch (error) {
      setActionError(getApiErrorMessage(error) ?? t("doctor:banks.confirmDelete.title"));
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    setActionError(null);
    try {
      await deleteQuestion({ questionId, bankId: selectedBankId }).unwrap();
    } catch (error) {
      setActionError(getApiErrorMessage(error) ?? t("admin:banks.actionErrors.deleteQuestionFailed"));
    }
  };

  const handleUpdateQuestion = async (
    questionId: string,
    data: { questionText: string; explanation?: string; options: QuestionOption[]; type: QuestionType },
  ) => {
    setActionError(null);
    try {
      await updateQuestion({ questionId, bankId: selectedBankId, data }).unwrap();
      return true;
    } catch (error) {
      setActionError(getApiErrorMessage(error) ?? t("admin:banks.actionErrors.updateQuestionFailed"));
      return false;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-md shadow-[#404293]/25">
              <BrainCircuit className="h-[18px] w-[18px] text-white" />
            </div>
            <h1 className={`text-xl font-black tracking-tight ${headingClass(isDark)}`}>
              {t("doctor:banks.title")}
            </h1>
          </div>
          <p className={`text-sm font-medium ${mutedClass(isDark)}`}>{t("doctor:banks.subtitle")}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => banksQuery.refetch()}
            title={t("common:actions.refresh")}
            aria-label={t("common:actions.refresh")}
            className={iconButtonClass(isDark)}
          >
            <RefreshCcw className={`h-4 w-4 ${banksQuery.isFetching ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#404293] to-[#2376BB] px-5 py-2.5 text-sm font-bold text-white shadow-xl shadow-[#404293]/30 transition-all hover:-translate-y-0.5 hover:shadow-[#404293]/45 active:scale-[0.98]"
          >
            <Plus size={17} /> {t("doctor:banks.uploadTitle")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`flex items-center gap-3 px-4 py-3.5 transition-shadow hover:shadow-md ${cardClass(isDark)}`}>
            <div
              className="h-8 w-1.5 shrink-0 rounded-full"
              style={{ background: `linear-gradient(180deg,${stat.color},${stat.color}55)` }}
            />
            <div>
              <p className={`text-lg font-black leading-none ${headingClass(isDark)}`}>{stat.value}</p>
              <p className={`mt-0.5 text-[11px] font-semibold ${mutedClass(isDark)}`}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`overflow-hidden ${cardClass(isDark)}`}>
        <div
          className={`flex items-center justify-between gap-4 px-6 py-4 border-b ${
            isDark ? "border-white/10 bg-white/[0.02]" : "border-gray-100 bg-gray-50/60"
          }`}
        >
          {selectedBankId ? (
            <button
              onClick={backToList}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-semibold shadow-sm transition-all ${
                isDark
                  ? "border-white/10 bg-white/5 text-gray-300 hover:text-[#7fb5e4] hover:border-[#2376BB]/40"
                  : "border-gray-200 bg-white text-gray-600 hover:text-[#404293] hover:border-[#404293]/30"
              }`}
            >
              <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} /> {t("doctor:banks.backToList")}
            </button>
          ) : (
            <div className={`flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border px-3.5 py-2.5 ${
              isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"
            }`}>
              <Search className={`h-4 w-4 shrink-0 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("doctor:banks.searchPlaceholder")}
                className={`flex-1 bg-transparent text-sm outline-none placeholder-gray-400 ${isDark ? "text-gray-200" : "text-gray-700"}`}
              />
              {search && (
                <button type="button" onClick={() => setSearch("")}>
                  <X size={13} className="text-gray-400 hover:text-gray-500" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="p-6 min-h-[380px]">
          {banksQuery.isError && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className={`mb-4 ${errorAlertClass(isDark)}`}>
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMessage(banksQuery.error)}
            </motion.div>
          )}

          {selectedBankId ? (
            bankLoading && !bank ? (
              <div className="flex items-center justify-center gap-2 py-20 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">{t("admin:banks.loading.bank")}</span>
              </div>
            ) : !bank ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FolderOpen className={`h-7 w-7 mb-4 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
                <p className={`font-bold ${mutedClass(isDark)}`}>{t("admin:banks.empty.bankNotFoundTitle")}</p>
              </div>
            ) : (
              <BankReviewPanel
                bank={bank}
                questions={questions}
                isDark={isDark}
                isLoading={bankLoading}
                isMutating={isMutating}
                actionError={actionError}
                permissions={DOCTOR_BANK_PERMISSIONS}
                onPublish={() => handlePublish(bank._id)}
                onUnpublish={() => handleUnpublish(bank._id)}
                onDeleteBank={() => handleDeleteBank(bank._id)}
                onDeleteQuestion={handleDeleteQuestion}
                onUpdateQuestion={(questionId, data) => handleUpdateQuestion(questionId, data)}
                onAddQuestions={() => setShowUpload(true)}
              />
            )
          ) : banksQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className={`h-28 w-full animate-pulse rounded-2xl ${isDark ? "bg-white/5" : "bg-gray-100"}`} />
              ))}
            </div>
          ) : filteredBanks.length === 0 ? (
            <div className={`flex flex-col items-center justify-center py-16 text-center ${emptyBoxClass(isDark)}`}>
              <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
                <FolderOpen className={`h-7 w-7 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
              </div>
              <p className={`mb-1 font-bold ${mutedClass(isDark)}`}>{t("doctor:banks.empty.noBanksTitle")}</p>
              <p className={`mb-4 text-sm ${faintClass(isDark)}`}>
                {t(search ? "doctor:banks.empty.noMatches" : "doctor:banks.empty.uploadFirst")}
              </p>
              {!search && (
                <button
                  onClick={() => setShowUpload(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white text-sm font-bold shadow-md"
                >
                  <Plus size={14} /> {t("doctor:banks.uploadTitle")}
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {filteredBanks.map((item) => (
                  <BankCard
                    key={item._id}
                    bank={item}
                    isDark={isDark}
                    disabled={isMutating}
                    onOpen={() => openBank(item._id)}
                    onPublish={() => handlePublish(item._id)}
                    onUnpublish={() => handleUnpublish(item._id)}
                    onDelete={() => handleDeleteBank(item._id)}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showUpload && (
          <DoctorBankUploadModal
            isDark={isDark}
            onClose={() => setShowUpload(false)}
            onUploaded={() => banksQuery.refetch()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
