// src/features/auth/components/ProtectedRoute.tsx
import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import type { UserRole } from "../types/auth.types"; // تأكد من صحة المسار

type Props = {
  children?: ReactNode;
  // ✅ هنا نفرض أن المصفوفة يجب أن تحتوي فقط على قيم UserRole الصحيحة
  allowedRoles?: UserRole[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { isAuthenticated, isLoading, user } = useAuth(); 
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#404293] border-t-transparent"></div>
          <span>جاري التحقق من الصلاحيات...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    // ✅ هذه المقارنة آمنة 100% لأن user.role من نوع UserRole
    // والمصفوفة allowedRoles تحتوي فقط على قيم UserRole
    const hasRequiredRole = allowedRoles.includes(user.role);
    
    if (!hasRequiredRole) {
      // توجيه ذكي بناءً على دور المستخدم الفعلي
      const isAdminRole = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
      const fallbackPath = isAdminRole ? "/admin" : "/user";
      
      return <Navigate to={fallbackPath} replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
}