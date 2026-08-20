import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FocusTimerCardProps {
  isDark: boolean;
}

const DURATIONS = [15, 25, 30, 50];

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default function FocusTimerCard({ isDark }: FocusTimerCardProps) {
  const { t } = useTranslation("dashboard");
  const [duration, setDuration] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [active, setActive] = useState(false);
  const isRunning = active && secondsLeft > 0;

  useEffect(() => {
    if (!isRunning) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRunning]);

  const changeDuration = (minutes: number) => {
    setActive(false);
    setDuration(minutes);
    setSecondsLeft(minutes * 60);
  };

  const reset = () => {
    setActive(false);
    setSecondsLeft(duration * 60);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] border p-5 shadow-sm backdrop-blur-md ${
        isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-white/80"
      }`}
    >
      {isRunning && <div className="pointer-events-none absolute inset-0 animate-pulse bg-[#2376BB]/5" />}

      <div className="relative z-10 mb-2 flex w-full items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Timer
            className={`h-5 w-5 ${isRunning ? "text-[#2376BB]" : isDark ? "text-gray-400" : "text-gray-500"}`}
          />
          <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
            {t("focusTimer.title")}
          </h3>
        </div>
        <select
          value={duration}
          onChange={(event) => changeDuration(Number(event.target.value))}
          disabled={active}
          aria-label={t("focusTimer.durationLabel")}
          className={`cursor-pointer appearance-none rounded-lg px-2 py-1 text-center text-xs font-bold outline-none disabled:opacity-50 ${
            isDark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-600"
          }`}
        >
          {DURATIONS.map((minutes) => (
            <option key={minutes} value={minutes}>
              {t("focusTimer.minutesOption", { minutes })}
            </option>
          ))}
        </select>
      </div>

      <div
        className={`relative z-10 mb-4 text-4xl font-black tracking-tight ${
          isRunning ? "text-[#2376BB]" : isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {formatTime(secondsLeft)}
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setActive((prev) => !prev)}
          disabled={secondsLeft === 0}
          aria-label={t(isRunning ? "focusTimer.pause" : "focusTimer.start")}
          className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-all disabled:opacity-40 ${
            isRunning
              ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
              : "bg-[#2376BB]/10 text-[#2376BB] hover:bg-[#2376BB]/20"
          }`}
        >
          {isRunning ? (
            <Pause className="h-4 w-4 fill-current" />
          ) : (
            <Play className="h-4 w-4 translate-x-0.5 fill-current" />
          )}
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label={t("focusTimer.reset")}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
            isDark ? "bg-white/10 text-gray-300 hover:bg-white/20" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
