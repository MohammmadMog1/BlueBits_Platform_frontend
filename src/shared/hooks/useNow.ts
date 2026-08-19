import { useEffect, useState } from "react";

const MINUTE_MS = 60_000;

/**
 * الوقت الحالي كقيمة حالة تتحدّث كل فترة.
 * تُستخدم بدل `Date.now()` داخل الـ render (استدعاء غير نقي)،
 * وتجعل عبارات "متبقٍ ساعتان" تتحدّث من نفسها دون إعادة تحميل الصفحة.
 */
export function useNow(intervalMs: number = MINUTE_MS): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
