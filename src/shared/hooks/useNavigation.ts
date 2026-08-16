import { useNavigate, useLocation } from "react-router-dom";
import { useCallback } from "react";

export function useNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = useCallback(
    (path: string, onClose?: () => void) => {
      navigate(path);
      onClose?.();
    },
    [navigate]
  );

  const isActive = useCallback(
    (path: string) => {
      return location.pathname === path || location.pathname.startsWith(path + "/");
    },
    [location.pathname]
  );

  return { handleNav, isActive };
}