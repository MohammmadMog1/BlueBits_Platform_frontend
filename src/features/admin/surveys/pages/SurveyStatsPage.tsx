/**
 * SurveyStatsPage
 *
 * إحصاءات ردود الاستبيان: متوسط الصعوبة وأيام الراحة المفضّلة
 * وعدد الحملة لكل مادة – هي المدخل الذي يعتمد عليه توليد برنامج الفحص.
 */
import { useTheme } from "next-themes";
import {
  AlertCircle,
  BarChart3,
  GraduationCap,
  Inbox,
  RefreshCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import SubjectStatsTable from "../components/SubjectStatsTable";
import { useSurveyStats } from "../hooks/useSurveyStats";
import type { StatsScope, SubjectStatsSortKey } from "../types";
import { formatDate } from "../utils/survey";
import {
  statusLabel,
  dividerClass,
  errorAlertClass,
  faintClass,
  fieldClass,
  headingClass,
  iconButtonClass,
  mutedClass,
  panelClass,
  segmentButtonClass,
  skeletonClass,
} from "../utils/surveyTheme";

const SCOPES: { value: StatsScope; label: string }[] = [
  { value: "year", label: "سنة محددة" },
  { value: "all", label: "كل السنوات" },
];

const SORTS: { value: SubjectStatsSortKey; label: string }[] = [
  { value: "difficulty", label: "الأصعب أولاً" },
  { value: "days", label: "الأكثر حاجة لراحة" },
  { value: "responses", label: "الأكثر إجابات" },
  { value: "carrying", label: "الأكثر حملة" },
  { value: "name", label: "أبجدياً" },
];

export default function SurveyStatsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    years,
    yearForms,
    blocks,
    scope,
    selectedYearId,
    formId,
    sortKey,
    search,
    yearsLoading,
    isLoading,
    isFetching,
    error,
    isYearEmpty,
    selectScope,
    selectYear,
    setFormId,
    setSortKey,
    setSearch,
    refetch,
  } = useSurveyStats();

  return (
    <div className="mx-auto flex max-w-[1300px] flex-col gap-6">
      {/* ── الترويسة ─────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-lg shadow-[#404293]/25">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1
              className={`text-xl font-black tracking-tight sm:text-2xl ${headingClass(isDark)}`}
            >
              إحصاءات الاستبيان
            </h1>
            <p className={`mt-0.5 text-sm font-medium ${mutedClass(isDark)}`}>
              متوسط الصعوبة وأيام الراحة المطلوبة وعدد الحملة لكل مادة
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={refetch}
          title="تحديث"
          className={iconButtonClass(isDark)}
        >
          <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* ── أدوات التصفية ────────────────────── */}
      <div className={`${panelClass(isDark)} space-y-4 p-4`}>
        {/* النطاق */}
        <div className="flex flex-wrap gap-2">
          {SCOPES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => selectScope(item.value)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${segmentButtonClass(
                isDark,
                scope === item.value,
              )}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* السنة + الفورم – في نطاق السنة فقط */}
        {scope === "year" && (
          <div className={`space-y-3 border-t pt-3 ${dividerClass(isDark)}`}>
            <div className="flex items-center gap-2">
              <GraduationCap
                className={`h-4 w-4 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`}
              />
              <h2 className={`text-xs font-black ${headingClass(isDark)}`}>
                السنة الدراسية
              </h2>
            </div>

            {yearsLoading ? (
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className={`${skeletonClass(isDark)} h-10 w-24`} />
                ))}
              </div>
            ) : years.length === 0 ? (
              <p className={`text-xs font-semibold ${mutedClass(isDark)}`}>
                لا توجد سنوات دراسية – أضفها من صفحة الهيكل الأكاديمي أولاً.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {years.map((year) => (
                  <button
                    key={year._id}
                    type="button"
                    onClick={() => selectYear(year._id)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${segmentButtonClass(
                      isDark,
                      year._id === selectedYearId,
                    )}`}
                  >
                    {year.name}
                  </button>
                ))}
              </div>
            )}

            {yearForms.length > 0 && (
              <div>
                <label
                  className={`mb-1.5 block text-[11px] font-black ${mutedClass(isDark)}`}
                >
                  الفورم (اتركه فارغاً لفورم السنة الحالي)
                </label>
                <select
                  value={formId}
                  onChange={(event) => setFormId(event.target.value)}
                  className={`${fieldClass(isDark)} max-w-md py-2.5`}
                >
                  <option value="">الفورم الحالي</option>
                  {yearForms.map((form) => (
                    <option key={form._id} value={form._id}>
                      {form.academicYear} — {statusLabel(form.status)} —{" "}
                      {formatDate(form.createdAt)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* الترتيب والبحث */}
        <div
          className={`flex flex-wrap items-center gap-3 border-t pt-3 ${dividerClass(isDark)}`}
        >
          <div className="relative">
            <SlidersHorizontal
              className={`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${faintClass(isDark)}`}
            />
            <select
              value={sortKey}
              onChange={(event) =>
                setSortKey(event.target.value as SubjectStatsSortKey)
              }
              className={`${fieldClass(isDark)} w-auto py-2.5 pr-11`}
            >
              {SORTS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative min-w-[200px] flex-1">
            <Search
              className={`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${faintClass(isDark)}`}
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث باسم المادة..."
              className={`${fieldClass(isDark)} py-2.5 pr-11`}
            />
          </div>
        </div>
      </div>

      {/* ── التنبيهات ────────────────────────── */}
      {error && (
        <div className={errorAlertClass(isDark)}>
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── المحتوى ──────────────────────────── */}
      {isLoading ? (
        <div className={`${panelClass(isDark)} space-y-4 p-6`}>
          <div className={`${skeletonClass(isDark)} h-8 w-1/3`} />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={`${skeletonClass(isDark)} h-16`} />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className={`${skeletonClass(isDark)} h-16`} />
          ))}
        </div>
      ) : isYearEmpty || blocks.length === 0 ? (
        <div
          className={`${panelClass(isDark)} flex flex-col items-center justify-center py-24 text-center`}
        >
          <div
            className={`mb-5 flex h-20 w-20 items-center justify-center rounded-full ${
              isDark ? "bg-white/5" : "bg-gray-100"
            }`}
          >
            <Inbox className={`h-9 w-9 ${faintClass(isDark)}`} />
          </div>
          <h2 className={`mb-2 text-lg font-black ${headingClass(isDark)}`}>
            لا توجد إحصاءات
          </h2>
          <p className={`max-w-md text-sm ${mutedClass(isDark)}`}>
            {scope === "year"
              ? "لا يوجد فورم لهذه السنة، أو لم يُجب أي طالب بعد"
              : "لم تُنشأ فورمات أو لم تصل ردود بعد"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block) => (
            <SubjectStatsTable
              key={`${block.yearId}-${block.formId}`}
              block={block}
              isDark={isDark}
            />
          ))}
        </div>
      )}
    </div>
  );
}
