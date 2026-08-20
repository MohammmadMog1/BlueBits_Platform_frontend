// src/features/profile/components/ConfirmModal.tsx
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onClose: () => void;
  children?: React.ReactNode; // محتوى إضافي (مثل حقل كتابة DELETE)
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  loading = false,
  disabled = false,
  variant = "danger",
  onConfirm,
  onClose,
  children,
}: ConfirmModalProps) {
  const { t } = useTranslation("common");
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto rounded-2xl bg-white border border-gray-200 shadow-2xl p-6 animate-fadeIn"
      >
        <div className="flex items-start justify-between gap-4">
          <div
            className={`p-2.5 rounded-xl ${
              variant === "danger" ? "bg-red-50 text-red-500" : "bg-[#404293]/10 text-[#404293]"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            aria-label={t("actions.close")}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="mt-3 text-[16px] font-bold text-gray-800">{title}</h3>
        <p className="mt-1.5 text-[13px] text-gray-500 leading-relaxed">{description}</p>

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
          >
            {t("actions.cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={disabled || loading}
            className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
              variant === "danger"
                ? "bg-gradient-to-r from-red-500 to-red-600 shadow-md shadow-red-500/25 hover:shadow-lg"
                : "bg-gradient-to-r from-[#404293] to-[#2376BB] shadow-md shadow-[#404293]/25 hover:shadow-lg"
            }`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}