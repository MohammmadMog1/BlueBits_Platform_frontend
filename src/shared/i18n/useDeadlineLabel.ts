// src/shared/i18n/useDeadlineLabel.ts
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { DeadlineInfo } from "../utils/datetime";

/**
 * يحوّل وصف الموعد البنيوي القادم من `deadlineInfo` إلى نصّ مترجَم.
 *
 * فُصل عن `deadlineInfo` لأن الأخيرة دالة عادية تُستدعى خارج شجرة React،
 * بينما الترجمة تحتاج اللغة الحالية. i18next يتكفّل بصيغ الجمع العربية الست.
 */
export function useDeadlineLabel() {
  const { t } = useTranslation();

  return useCallback(
    (info: DeadlineInfo): string =>
      info.key === "none" || info.key === "passed"
        ? t(`deadline.${info.key}`)
        : t(`deadline.${info.key}`, { count: info.count }),
    [t],
  );
}
