import { Outlet } from "react-router-dom";
import LiveBackground from "./LiveBackground";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 lg:flex">
      <LiveBackground variant="light" />
      <Sidebar />
      <div className="relative z-10 min-w-0 flex-1">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
