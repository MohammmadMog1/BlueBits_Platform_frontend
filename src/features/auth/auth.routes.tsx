import type { RouteObject } from "react-router"; 
import  LoginPage  from "./pages/LoginPage";
import  RegisterPage  from "./pages/RegisterPage";
import AuthLayout from "../../shared/layout/AuthLayout";
import VerifyPage from "./pages/VerifyPage";

export const authRoutes: RouteObject[] = [
  {
    element: <AuthLayout />, 
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path:"/verify",
        element:<VerifyPage/>,
      },
    ],
  },
];