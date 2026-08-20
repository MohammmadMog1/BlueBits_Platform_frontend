// src/shared/i18n/useErrorMessage.ts
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { serverMessage } from "../utils/apiError";

/**
 * يحوّل خطأ RTK Query إلى نصّ للعرض: رسالة الخادم إن وُجدت،
 * وإلا نصّ بديل مترجَم من `common:errors.*`.
 *
 * وُضع كـ hook لأن النصّ البديل يتغيّر مع اللغة، بينما استخراج رسالة
 * الخادم يبقى دالة عادية في `shared/utils/apiError`.
 */
export function useErrorMessage() {
  const { t } = useTranslation();

  return useCallback(
    (error: unknown, fallback?: string): string =>
      serverMessage(error) ?? fallback ?? t("errors.generic"),
    [t],
  );
}
