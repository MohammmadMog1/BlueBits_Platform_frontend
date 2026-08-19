// src/shared/hooks/useContextSwitch.ts
import { useLocation } from "react-router-dom";
import { LogOut, ShieldCheck, type LucideIcon } from "lucide-react";
import type { NavKey } from "../i18n/types";

export interface ContextSwitchAction {
  path: string;
  /** مفتاح ترجمة – يُترجَم في المكوّن الذي يعرضه */
  labelKey: NavKey;
  icon: LucideIcon;
}

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

/**
 * Computes the "switch area" action (Admin <-> User) based on the current
 * route and the user's role. Shared by Sidebar (desktop) and
 * BottomBar/MoreOpen (mobile) so both surfaces stay in sync.
 */
export function useContextSwitch(role: string): ContextSwitchAction | null {
  const location = useLocation();
  const isInAdminArea = location.pathname.startsWith("/admin");
  const isInUserArea = location.pathname.startsWith("/user");
  const isAdminRole = ADMIN_ROLES.includes(role);

  if (isInAdminArea) {
    return { path: "/user", labelKey: "nav:switch.backToApp", icon: LogOut };
  }

  if (isInUserArea && isAdminRole) {
    return { path: "/admin", labelKey: "nav:switch.goToAdmin", icon: ShieldCheck };
  }

  return null;
}
