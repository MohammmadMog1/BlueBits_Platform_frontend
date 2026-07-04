import type { RouteObject } from "react-router"; 
import  LoginPage  from "./pages/LoginPage";
import  RegisterPage  from "./pages/RegisterPage";
import AuthLayout from "../../shared/layout/AuthLayout";
import {ResetPasswordPage} from "./pages/ResetPasswordPage";
import {ForgetPasswordPage} from "./pages/ForgetPasswordPage";
import VerifyPage from "./pages/VerifyPage";

export const authRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: <AuthLayout />, 
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path:"/verify",
    element:<VerifyPage/>,
  },
  {
    path:"/forget-password",
    element:<ForgetPasswordPage/>,
  },
  {
    path:"/reset-password",
    element:<ResetPasswordPage/>,
  },
];