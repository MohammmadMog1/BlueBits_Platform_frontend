import { motion, AnimatePresence } from "motion/react";
import { Shield, LogIn, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AuthModalProps {
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export function AuthModal({ onClose, onNavigate }: AuthModalProps) {
  const { t } = useTranslation(["landing", "common"]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-white dark:bg-[#151720] border dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="h-1.5 bg-gradient-to-r from-[#404293] to-[#2376BB]" />

          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#404293]/10 to-[#2376BB]/10 flex items-center justify-center mx-auto mb-5 border border-[#404293]/15 dark:border-[#404293]/30">
              <Shield className="w-8 h-8 text-[#404293]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t("authModal.title")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-7">
              {t("authModal.descriptionLine1")}
              <br />
              {t("authModal.descriptionLine2")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onNavigate("/auth");
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <LogIn className="w-4 h-4" />
                {t("authModal.login")}
              </button>
              <button
                onClick={() => {
                  onNavigate("/auth");
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border-2 border-[#404293] text-[#404293] dark:text-[#9fa8e8] dark:border-[#404293]/40 font-bold text-sm hover:bg-[#404293]/5 dark:hover:bg-[#404293]/10 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                {t("authModal.register")}
              </button>
            </div>
            <button
              onClick={onClose}
              className="mt-4 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {t("common:actions.close")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
