/**
 * رسالة الخطأ القادمة من الباك (envelope فيه message).
 * نفس منطق `errorMessage` المكرّر في صفحات الإدارة — الصفحات الجديدة تستورده من هنا.
 */
export const errorMessage = (
  error: unknown,
  fallback = "تعذّر تنفيذ الطلب. حاول مرة أخرى.",
): string => {
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
  return fallback;
};
