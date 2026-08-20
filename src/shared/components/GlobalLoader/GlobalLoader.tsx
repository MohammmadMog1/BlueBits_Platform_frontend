import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../features/auth/redux/hooks";

export default function GlobalLoader() {
  const { t } = useTranslation("common");
  const { isLoading: authLoading } = useAppSelector((state) => state.auth);
  const { isLoading: globalLoading } = useAppSelector((state) => state.loading);

  if (!authLoading && !globalLoading) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed end-4 top-4 z-[60] flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-200 shadow-lg shadow-black/20 backdrop-blur-md">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#404293] border-t-transparent" />
      <span>{t("states.loading")}</span>
    </div>
  );
}
