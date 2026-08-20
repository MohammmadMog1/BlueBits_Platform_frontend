/**
 * رسالة الخطأ القادمة من الباك (envelope فيه message).
 *
 * تُرجع `null` عند غياب الرسالة بدل نصّ بديل جاهز: النصّ البديل مترجَم،
 * والترجمة تحتاج اللغة الحالية التي لا تعرفها دالة عادية خارج شجرة React.
 * استخدم `useErrorMessage` في المكوّنات والـ hooks للحصول على البديل المترجَم.
 */
export const serverMessage = (error: unknown): string | null => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data: unknown }).data;
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
    ) {
      return (data as { message: string }).message;
    }
  }
  return null;
};
