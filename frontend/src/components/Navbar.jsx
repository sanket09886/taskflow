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
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm text-slate-500">Team task manager</p>
          <h1 className="text-lg font-bold text-slate-950">Welcome, {user?.name}</h1>
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
