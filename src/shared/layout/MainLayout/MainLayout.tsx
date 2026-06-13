import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import BottomBar from "../../components/BottomBar/BottomBar";

const MainLayout = () => {
  return (   
    <div className="flex h-screen">
       <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
        <BottomBar />
      </div>
    </div>
    // <Footer/>
    // </Container>
  );
};

export default MainLayout;
