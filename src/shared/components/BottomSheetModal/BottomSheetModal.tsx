import type { ReactNode } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";

interface BottomSheetModalProps {
  onClose: () => void;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  isDark: boolean;
  maxWidthClassName?: string;
}

export default function BottomSheetModal({
  onClose,
  icon,
  title,
  subtitle,
  children,
  footer,
  isDark,
  maxWidthClassName = "sm:max-w-lg",
}: BottomSheetModalProps) {
  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center sm:items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 30 }}
        onClick={(event) => event.stopPropagation()}
        className={`relative flex max-h-[92dvh] w-full flex-col rounded-t-3xl shadow-2xl sm:mx-4 sm:max-h-[85dvh] sm:rounded-3xl ${maxWidthClassName} ${
          isDark ? "border border-white/10 bg-[#1a1b1e]" : "border border-gray-200 bg-white"
        }`}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className={`h-1 w-10 rounded-full ${isDark ? "bg-white/20" : "bg-gray-300"}`} />
        </div>

        <div
          className={`flex items-center justify-between border-b px-6 pb-4 pt-5 sm:px-7 sm:pt-6 ${
            isDark ? "border-white/8" : "border-gray-100"
          }`}
        >
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-md shadow-[#404293]/25">
                {icon}
              </div>
            )}
            <div>
              <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {title}
              </h3>
              {subtitle && (
                <p className={`mt-0.5 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
              isDark ? "bg-white/10 text-gray-300 hover:bg-white/15" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-7 sm:py-6">{children}</div>

        {footer && (
          <div
            className={`border-t px-6 py-4 sm:px-7 ${isDark ? "border-white/8" : "border-gray-100"}`}
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
          >
            {footer}
          </div>
        )}
      </motion.div>
    </div>
  );
}
