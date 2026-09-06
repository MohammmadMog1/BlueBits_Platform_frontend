/** يهرّب قيمة لصيغة CSV: يحيط بعلامتَي اقتباس عند وجود فاصلة أو اقتباس أو سطر جديد */
export const csvEscape = (value: string | number): string => {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
};

/** يبني نص CSV من صفوف (كل صف مصفوفة خلايا)، ويهرّب كل خلية تلقائياً */
export const rowsToCsv = (rows: (string | number)[][]): string =>
  rows.map((row) => row.map(csvEscape).join(",")).join("\n");

/**
 * ينزّل نصاً كملف على جهاز المستخدم – تُستخدم لتصدير CSV.
 * الـ BOM في البداية يضمن ظهور الأحرف العربية بشكل صحيح عند فتح الملف في Excel.
 */
export const downloadTextFile = (
  filename: string,
  content: string,
  mimeType = "text/csv;charset=utf-8;",
): void => {
  const blob = new Blob(["﻿" + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
