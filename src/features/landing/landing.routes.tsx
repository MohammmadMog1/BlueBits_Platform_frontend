/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';

import type{ RouteObject } from "react-router";
const LandingPage = lazy(() => import('../../features/landing/LandingPage'));
import GlobalError from "../../shared/components/ErrorBoundary/GlobalError";

export const landingRoutes: RouteObject[] = [
  {
    path: "/",
    element: <LandingPage />,
        errorElement: <GlobalError title="Error loading page" message="Please try again later" />,
  },
];