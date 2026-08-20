import { useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, X, AlertCircle, RefreshCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../shared/i18n/useLanguage";
import { useGrantPermissionMutation, useRevokePermissionMutation } from "../api/usersApiSlice";
import { PERMISSIONS_LIST } from "../types";
import type { Permission, User } from "../types";

interface ManagePermissionsModalProps {
  user: User;
  onClose: () => void;
  onError: (message: string) => void;
}

export default function ManagePermissionsModal({ user, onClose, onError }: ManagePermissionsModalProps) {
  const { t } = useTranslation(["users", "common"]);
  const { isRTL } = useLanguage();
  const [grantPermission, { isLoading: isGranting }] = useGrantPermissionMutation();
  const [revokePermission, { isLoading: isRevoking }] = useRevokePermissionMutation();
  const [pendingPermission, setPendingPermission] = useState<Permission | null>(null);

  const activePermissions = user.permissions ?? [];
  const isBusy = isGranting || isRevoking;

  const handleToggle = async (permission: Permission, hasPermission: boolean) => {
    setPendingPermission(permission);
    try {
      if (hasPermission) {
        await revokePermission({ id: user._id, permission }).unwrap();
      } else {
        await grantPermission({ id: user._id, permission }).unwrap();
      }
    } catch {
      onError(t("permissions.updateFailed"));
    } finally {
      setPendingPermission(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 24 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="px-7 pt-7 pb-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-md shadow-[#404293]/25">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                {t("permissions.title", { name: user.name })}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {t("permissions.subtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        <div className="px-7 py-6 space-y-3">
          {PERMISSIONS_LIST.map((permission) => {
            const hasPermission = activePermissions.includes(permission);
            const isPending = pendingPermission === permission && isBusy;

            return (
              <div
                key={permission}
                className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3.5 transition-colors ${
                  hasPermission ? "border-[#404293]/25 bg-[#404293]/5" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900">
                    {t(`permissions.${permission}.label`)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t(`permissions.${permission}.description`)}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => handleToggle(permission, hasPermission)}
                  className={`relative shrink-0 w-11 h-6 rounded-full transition-colors disabled:opacity-50 ${
                    hasPermission ? "bg-[#404293]" : "bg-gray-300"
                  }`}
                >
                  {isPending ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <RefreshCcw size={11} className="text-white" />
                    </motion.div>
                  ) : (
                    <span
                      className={`absolute top-0.5 start-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                        hasPermission
                          ? isRTL
                            ? "-translate-x-5"
                            : "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  )}
                </button>
              </div>
            );
          })}

          <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
            <AlertCircle size={13} className="shrink-0" />
            {t("permissions.autoSaveHint")}
          </div>
        </div>

        <div className="px-7 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            {t("common:actions.close")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
