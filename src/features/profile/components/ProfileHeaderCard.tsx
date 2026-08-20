// src/features/profile/components/ProfileHeaderCard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BadgeCheck, Mail, CalendarDays, LogOut, Loader2 } from "lucide-react";
import ProfileImageUploader from "./ProfileImageUploader";
import { useFormatters } from "../../../shared/i18n/useFormatters";
import { useAuth } from "../../auth/hooks/useAuth";
import type { User } from "../types/profile.types";

interface Props {
  user: User;
  onUpdated: (updated: User) => void;
}

export default function ProfileHeaderCard({ user, onUpdated }: Props) {
  const { t } = useTranslation(["profile", "common"]);
  const { formatMediumDateOrDash } = useFormatters();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate("/");
  };

  return (
    <div className="rounded-2xl bg-white/98 border border-gray-200/80 shadow-sm overflow-hidden">
      {/* Banner */}
      <div className="h-32 sm:h-36 bg-gradient-to-r from-[#404293] to-[#2376BB] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,white_1px,transparent_1px)] bg-[length:16px_16px]" />
        <div className="absolute -right-8 -top-10 w-44 h-44 rounded-full bg-white/10 blur-2xl" />
      </div>

      <div className="px-6 pb-6">
        {/* Avatar: isolated row so it can overlap the banner without dragging
            the text below into the low-contrast zone (bug: text used to sit
            on the banner via items-end + shared negative margin). */}
        <div className="-mt-14 sm:-mt-16 inline-block">
          <ProfileImageUploader user={user} onUpdated={onUpdated} />
        </div>

        {/* Info: always in normal flow, guaranteed clear of the banner */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[22px] font-bold text-gray-800">{user.name}</h1>
              {user.isVerified && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-semibold">
                  <BadgeCheck className="w-3.5 h-3.5" /> {t("profile:headerCard.verified")}
                </span>
              )}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                title={t("common:profile.logout")}
                aria-label={t("common:profile.logout")}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                {loggingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="mt-2 flex items-center gap-4 flex-wrap text-[12px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />{" "}
                {t("profile:headerCard.joined", {
                  date: formatMediumDateOrDash(user.createdAt),
                })}
              </span>
            </div>
          </div>

          {/* Role Badge */}
          <span className="self-start px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white text-[12px] font-semibold shadow-md shadow-[#404293]/25 uppercase tracking-wider">
            {t(`common:roles.${user.role}`)}
          </span>
        </div>
      </div>
    </div>
  );
}