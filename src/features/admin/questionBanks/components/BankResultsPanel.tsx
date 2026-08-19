import { useMemo } from "react";
import { Loader2, Trophy, Users } from "lucide-react";
import { useGetBankResultsQuery } from "../api/questionBanksApi";
import {
  formatDateTime,
  getApiErrorMessage,
  getStudentEmail,
  getStudentId,
  getStudentName,
  scoreColor,
} from "../utils/bank";

interface BankResultsPanelProps {
  bankId: string;
}

export function BankResultsPanel({ bankId }: BankResultsPanelProps) {
  const {
    data: attempts = [],
    isFetching,
    error,
  } = useGetBankResultsQuery(bankId, { skip: !bankId });

  const summary = useMemo(() => {
    if (attempts.length === 0) {
      return { students: 0, average: 0, best: 0 };
    }
    const students = new Set(attempts.map((attempt) => getStudentId(attempt))).size;
    const total = attempts.reduce(
      (sum, attempt) => sum + (attempt.scorePercentage ?? 0),
      0,
    );
    const best = attempts.reduce(
      (max, attempt) => Math.max(max, attempt.scorePercentage ?? 0),
      0,
    );
    return {
      students,
      average: Math.round(total / attempts.length),
      best,
    };
  }, [attempts]);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm font-medium">جارٍ تحميل النتائج…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-100 px-5 py-4 text-sm text-red-600">
        {getApiErrorMessage(error, "تعذّر جلب نتائج الطلاب.")}
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <Users className="w-7 h-7 text-gray-300" />
        </div>
        <p className="font-bold text-gray-400 mb-1">لا توجد محاولات بعد</p>
        <p className="text-sm text-gray-300">
          ستظهر نتائج الطلاب هنا بعد حل البنك.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Attempts", value: attempts.length, color: "#404293" },
          { label: "Students", value: summary.students, color: "#2376BB" },
          { label: "Average Score", value: `${summary.average}%`, color: "#059669" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3"
          >
            <div
              className="w-1.5 h-8 rounded-full flex-shrink-0"
              style={{
                background: `linear-gradient(180deg,${item.color},${item.color}55)`,
              }}
            />
            <div>
              <p className="text-lg font-black text-gray-900 leading-none">
                {item.value}
              </p>
              <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/80">
            <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Score</th>
              <th className="px-5 py-3">Correct</th>
              <th className="px-5 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {attempts.map((attempt) => {
              const percentage = attempt.scorePercentage ?? 0;
              const isBest = percentage === summary.best && percentage > 0;
              return (
                <tr key={attempt._id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {isBest && (
                        <Trophy size={13} className="text-amber-400 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 truncate">
                          {getStudentName(attempt)}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">
                          {getStudentEmail(attempt)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="inline-block px-2.5 py-1 rounded-full text-xs font-black"
                      style={{
                        color: scoreColor(percentage),
                        backgroundColor: `${scoreColor(percentage)}18`,
                      }}
                    >
                      {percentage}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 font-semibold">
                    {attempt.correctCount} / {attempt.totalQuestions}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs font-medium">
                    {formatDateTime(attempt.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
