// src/features/profile/components/ProfileDrawer.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X, RefreshCw, AlertTriangle, Loader2, LogOut } from "lucide-react";
import { useAppDispatch } from "../../../app/store/hooks";
import { useProfile } from "../hooks/useProfile";
import { useAuth } from "../../auth/hooks/useAuth";
import ProfileHeaderCard from "./ProfileHeaderCard";
import EditProfileForm from "./EditProfileForm";
import AccountInfoCard from "./AccountInfoCard";
import AccountStatusCard from "./AccountStatusCard";
import DangerZoneCard from "./DangerZoneCard";
import { updateUserInStore } from "../../auth/redux/authSlice";
import type { User } from "../types/profile.types";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({ open, onClose }: Props) {
  const { t } = useTranslation(["profile", "common"]);
  const { user, isLoading, isError, refetch } = useProfile();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    onClose();
    navigate("/");
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleUserUpdated = (updated: User) => {
    dispatch(updateUserInStore(updated));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-60 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("profile:drawer.ariaLabel")}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-70 w-full sm:w-[560px] bg-gray-50 shadow-2xl flex flex-col will-change-transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        {/* Sticky top bar */}
        <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-gray-200/80 bg-white/95 backdrop-blur-xl flex-shrink-0">
          <div className="min-w-0">
            <h2 className="text-[17px] font-bold text-gray-800">{t("profile:drawer.title")}</h2>
            <p className="text-[12px] text-gray-400 truncate">
              {t("profile:drawer.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              {loggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{t("common:profile.logout")}</span>
            </button>
            <button
              onClick={onClose}
              aria-label={t("common:actions.close")}
              className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
          {isLoading && !user ? (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-[#404293] animate-spin" />
                <p className="text-[13px] text-gray-400">{t("profile:drawer.loading")}</p>
              </div>
            </div>
          ) : isError || !user ? (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
              <div className="max-w-sm w-full rounded-2xl bg-white border border-red-200 shadow-sm p-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-[15px] font-bold text-gray-800">{t("profile:drawer.errorTitle")}</h3>
                <p className="mt-1 text-[12px] text-gray-400">
                  {t("profile:drawer.errorSubtitle")}
                </p>
                <button
                  onClick={refetch}
                  className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white text-[12px] font-semibold flex items-center gap-2 mx-auto shadow-md shadow-[#404293]/25"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t("common:actions.retry")}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <ProfileHeaderCard user={user} onUpdated={handleUserUpdated} />
              <EditProfileForm user={user} onUpdated={handleUserUpdated} />
              <AccountInfoCard user={user} />
              <AccountStatusCard />
              <DangerZoneCard />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
