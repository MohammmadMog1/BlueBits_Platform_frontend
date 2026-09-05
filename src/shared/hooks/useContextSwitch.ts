// src/shared/hooks/useContextSwitch.ts
import { useLocation } from "react-router-dom";
import { LogOut, ShieldCheck, Stethoscope, type LucideIcon } from "lucide-react";
import type { NavKey } from "../i18n/types";

export interface ContextSwitchAction {
  path: string;
  /** مفتاح ترجمة – يُترجَم في المكوّن الذي يعرضه */
  labelKey: NavKey;
  icon: LucideIcon;
}

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];
const DOCTOR_ROLES = ["DOCTOR"];

/**
 * Computes the "switch area" action (Admin/Doctor <-> User) based on the
 * current route and the user's role. Shared by Sidebar (desktop) and
 * BottomBar/MoreOpen (mobile) so both surfaces stay in sync.
 */
export function useContextSwitch(role: string): ContextSwitchAction | null {
  const location = useLocation();
  const isInAdminArea = location.pathname.startsWith("/admin");
  const isInDoctorArea = location.pathname.startsWith("/doctor");
  const isInUserArea = location.pathname.startsWith("/user");
  const isAdminRole = ADMIN_ROLES.includes(role);
  const isDoctorRole = DOCTOR_ROLES.includes(role);

  if (isInAdminArea) {
    return { path: "/user", labelKey: "nav:switch.backToApp", icon: LogOut };
  }

  if (isInDoctorArea) {
    return { path: "/user", labelKey: "nav:switch.backToApp", icon: LogOut };
  }

  if (isInUserArea && isAdminRole) {
    return { path: "/admin", labelKey: "nav:switch.goToAdmin", icon: ShieldCheck };
  }

  if (isInUserArea && isDoctorRole) {
    return { path: "/doctor", labelKey: "nav:switch.goToDoctor", icon: Stethoscope };
  }

  return null;
}
