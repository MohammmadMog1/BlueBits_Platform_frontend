// src/shared/components/NotificationsBell/NotificationsBell.tsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Megaphone } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useGetAnnouncementsQuery } from "../../../features/admin/announcements/api/announcementsApi";
import { useFormatters } from "../../i18n/useFormatters";

const LAST_SEEN_KEY = "bb-notifications-last-seen";
const MAX_VISIBLE = 8;

/** الصفحة التي يقصدها زر "عرض الكل" لكل دور – الأدوار غير المدرَجة لا ترى الرابط */
const VIEW_ALL_PATH_BY_ROLE: Record<string, string> = {
  ADMIN: "/admin/announcements",
  SUPER_ADMIN: "/admin/announcements",
  USER: "/user/announcements",
};

interface NotificationsBellProps {
  role: string;
}

export default function NotificationsBell({ role }: NotificationsBellProps) {
  const { t } = useTranslation();
  const { formatRelative } = useFormatters();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [open, setOpen] = useState(false);
  const [lastSeenAt, setLastSeenAt] = useState(
    () => Number(localStorage.getItem(LAST_SEEN_KEY)) || 0
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: announcements = [], isLoading, isError } = useGetAnnouncementsQuery(undefined, {
    pollingInterval: 60_000,
  });

  const sorted = [...announcements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const recent = sorted.slice(0, MAX_VISIBLE);
  const unreadCount = sorted.filter(
    (announcement) => new Date(announcement.createdAt).getTime() > lastSeenAt
  ).length;

  // إغلاق القائمة بالنقر خارجها أو بمفتاح Escape
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleToggle = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        const now = Date.now();
        localStorage.setItem(LAST_SEEN_KEY, String(now));
        setLastSeenAt(now);
      }
      return next;
    });
  };

  const viewAllPath = VIEW_ALL_PATH_BY_ROLE[role];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("notifications.count", { count: unreadCount })}
        className={`relative p-2.5 rounded-xl transition-all active:scale-90 ${
          isDark
            ? "bg-white/8 hover:bg-white/15 text-gray-400"
            : "bg-gray-100 hover:bg-gray-200 text-gray-500"
        }`}
      >
        <Bell className="w-[18px] h-[18px]" aria-hidden="true" />
        {unreadCount > 0 && (
          /* end-1.5 منطقي: أعلى اليسار في RTL وأعلى اليمين في LTR */
          <span className="absolute top-1.5 end-1.5 flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
            <span className="relative w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#1a1b1e]" />
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t("notifications.label")}
          /* end-0 منطقي: يبقى داخل حدود الشاشة سواء اتجاه الصفحة RTL أو LTR */
          className={`absolute top-full z-50 mt-2 w-[320px] max-w-[90vw] overflow-hidden rounded-2xl border shadow-xl end-0 ${
            isDark ? "border-white/10 bg-[#1a1b1e]" : "border-gray-200 bg-white"
          }`}
        >
          <div
            className={`px-4 py-3 border-b text-sm font-bold ${
              isDark ? "border-white/10 text-white" : "border-gray-100 text-gray-800"
            }`}
          >
            {t("notifications.label")}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-12 rounded-lg animate-pulse ${isDark ? "bg-white/5" : "bg-gray-100"}`}
                  />
                ))}
              </div>
            ) : isError ? (
              <p className={`px-4 py-6 text-center text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                {t("errors.loadFailed")}
              </p>
            ) : recent.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <Megaphone className={`w-6 h-6 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  {t("notifications.empty")}
                </p>
              </div>
            ) : (
              <ul>
                {recent.map((announcement) => (
                  <li
                    key={announcement._id}
                    className={`px-4 py-3 border-b last:border-b-0 ${
                      isDark ? "border-white/5" : "border-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className={`truncate text-xs font-bold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                        {announcement.title}
                      </p>
                      <span
                        className={`shrink-0 text-[10px] font-semibold ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {formatRelative(announcement.createdAt)}
                      </span>
                    </div>
                    <p className={`mt-1 line-clamp-2 text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {announcement.content}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {viewAllPath && recent.length > 0 && (
            <Link
              to={viewAllPath}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 text-center text-xs font-bold border-t transition-colors ${
                isDark
                  ? "border-white/10 text-[#5aa9e6] hover:bg-white/5"
                  : "border-gray-100 text-[#2376BB] hover:bg-gray-50"
              }`}
            >
              {t("actions.viewAll")}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
