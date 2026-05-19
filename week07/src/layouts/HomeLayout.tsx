import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import LpFormModal from "../components/LpFormModal";

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="h-dvh flex flex-col">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white text-2xl rounded-full shadow-lg flex items-center justify-center transition-colors cursor-pointer z-50"
      >
        +
      </button>
      {isModalOpen && <LpFormModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default HomeLayout;
