import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import useSidebar from "../hooks/useSidebar";

const HomeLayout = () => {
  const { isOpen, toggle, close } = useSidebar();

  return (
    <div className="h-dvh flex flex-col bg-zinc-950">
      <Navbar onMenuClick={toggle} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isOpen} onClose={close} />
        <main className="flex-1 overflow-y-auto bg-zinc-950">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default HomeLayout;
