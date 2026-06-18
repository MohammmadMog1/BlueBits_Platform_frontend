import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import BottomBar from "../../components/BottomBar/BottomBar";

import { useAppDispatch } from "../../../features/auth/redux/hooks";
import { getMeThunk } from "../../../features/auth/redux/authThunk";

const MainLayout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMeThunk());
  }, [dispatch]);

  return (
    // إضافة overflow-hidden لمنع التمرير المزدوج
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
        <BottomBar />
      </div>
    </div>
  );
};

export default MainLayout;
