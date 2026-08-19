import { useTheme } from "next-themes";

/**
 * اختصار للنمط المتكرّر: `const { theme } = useTheme(); const isDark = theme === "dark";`
 * كل الصفحات الجديدة تستخدمه بدل تكرار السطرين.
 */
export function useIsDark(): boolean {
  const { theme } = useTheme();
  return theme === "dark";
}
