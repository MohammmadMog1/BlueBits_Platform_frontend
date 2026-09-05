import { useState } from "react";
import { useTheme } from "next-themes";
import { AlertCircle, Megaphone, RefreshCcw, Search, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useErrorMessage } from "../../../shared/i18n/useErrorMessage";
import StudentAnnouncementCard from "../components/StudentAnnouncementCard";
import {
  AnnouncementDetailModal,
  useGetAnnouncementsQuery,
  useGetMyAnnouncementsQuery,
} from "../../admin/announcements";
import type { Announcement } from "../../admin/announcements";

type AnnouncementsTab = "all" | "mine";

const TABS = [
  { id: "all", labelKey: "student.tabAll", icon: Megaphone },
  { id: "mine", labelKey: "student.tabMine", icon: Users },
] as const satisfies readonly {
  id: AnnouncementsTab;
  labelKey: string;
  icon: typeof Megaphone;
}[];

export default function StudentAnnouncementsPage() {
  const { t } = useTranslation(["announcements", "common"]);
  const errorMessage = useErrorMessage();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<AnnouncementsTab>("all");
  const [search, setSearch] = useState("");
  const [viewingAnnouncement, setViewingAnnouncement] = useState<Announcement | null>(null);

  const allQuery = useGetAnnouncementsQuery();
  const myQuery = useGetMyAnnouncementsQuery();

  const query = activeTab === "all" ? allQuery : myQuery;
  const announcements: Announcement[] = query.data ?? [];

  const filteredAnnouncements = announcements.filter((announcement) => {
    const term = search.trim().toLowerCase();
    return (
      !term ||
      announcement.title.toLowerCase().includes(term) ||
      announcement.content.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className={`text-xl font-black tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
          {t("student.title")}
        </h1>
        <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-400"}`}>
          {t("student.subtitle")}
        </p>
      </div>

      <div
        className={`flex w-fit gap-1 rounded-2xl border p-1.5 shadow-sm ${
          isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-white"
        }`}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-md shadow-[#404293]/25"
                  : isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Icon size={15} /> {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div
          className={`flex min-w-[180px] flex-1 items-center gap-2 rounded-xl border px-3.5 py-2.5 ${
            isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"
          }`}
        >
          <Search className={`h-4 w-4 shrink-0 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className={`flex-1 bg-transparent text-sm outline-none placeholder-gray-400 ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} aria-label={t("clearSearch")}>
              <X size={13} className="text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => query.refetch()}
          title={t("common:actions.refresh")}
          aria-label={t("common:actions.refresh")}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all ${
            isDark
              ? "border-white/10 bg-white/5 text-gray-400 hover:border-[#2376BB]/40 hover:text-[#2376BB]"
              : "border-gray-200 bg-white text-gray-400 shadow-sm hover:border-[#404293]/30 hover:text-[#404293]"
          }`}
        >
          <RefreshCcw className={`h-4 w-4 ${query.isFetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      {query.isError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-sm font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMessage(query.error, t("student.loadFailed"))}
        </motion.div>
      )}

      {query.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`animate-pulse rounded-2xl border p-5 ${
                isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-white"
              }`}
            >
              <div className={`mb-5 h-1 w-full rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
              <div className={`mb-3 h-4 w-3/4 rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
              <div className={`mb-2 h-3 w-full rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
              <div className={`h-3 w-2/3 rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
            </div>
          ))}
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center rounded-3xl border py-20 text-center shadow-sm ${
            isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-white"
          }`}
        >
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
            <Megaphone className={`h-7 w-7 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
          </div>
          <p className={`mb-1 font-bold ${isDark ? "text-gray-400" : "text-gray-400"}`}>
            {t(
              search
                ? "student.emptyNoResults"
                : activeTab === "mine"
                  ? "student.emptyMine"
                  : "student.emptyAll",
            )}
          </p>
          <p className={`text-sm ${isDark ? "text-gray-600" : "text-gray-300"}`}>
            {t(search ? "student.emptySearchHint" : "student.emptyHint")}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAnnouncements.map((announcement) => (
              <StudentAnnouncementCard
                key={announcement._id}
                announcement={announcement}
                isDark={isDark}
                onView={setViewingAnnouncement}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      <AnimatePresence>
        {viewingAnnouncement && (
          <AnnouncementDetailModal
            announcement={viewingAnnouncement}
            isDark={isDark}
            onClose={() => setViewingAnnouncement(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
