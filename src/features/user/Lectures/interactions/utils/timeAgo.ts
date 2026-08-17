const arabicUnit = (count: number, singular: string, dual: string, plural: string) => {
  if (count === 1) return singular;
  if (count === 2) return dual;
  if (count >= 3 && count <= 10) return `${count} ${plural}`;
  return `${count} ${singular}`;
};

export function timeAgoArabic(iso: string): string {
  const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diffSec < 45) return "الآن";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `منذ ${arabicUnit(diffMin, "دقيقة", "دقيقتين", "دقائق")}`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `منذ ${arabicUnit(diffHour, "ساعة", "ساعتين", "ساعات")}`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `منذ ${arabicUnit(diffDay, "يوم", "يومين", "أيام")}`;

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `منذ ${arabicUnit(diffMonth, "شهر", "شهرين", "أشهر")}`;

  const diffYear = Math.floor(diffMonth / 12);
  return `منذ ${arabicUnit(diffYear, "سنة", "سنتين", "سنوات")}`;
}
