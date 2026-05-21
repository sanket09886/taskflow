import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { initials } from "../lib/utils";
import { Avatar, Button } from "./ui";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 shadow-sm backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-indigo-600">Team task manager</p>
          <h1 className="text-xl font-black text-slate-950">Welcome, {user?.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Avatar name={initials(user?.name)} />
          <span className="hidden text-sm font-semibold text-slate-700 sm:inline">{user?.name}</span>
          <Button variant="ghost" onClick={handleLogout} aria-label="Logout">
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}
