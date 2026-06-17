import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <div className="h-dvh flex flex-col bg-zinc-950">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
