import { FolderKanban, LayoutDashboard, ListTodo } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "My Tasks", icon: ListTodo }
];

export default function Sidebar() {
  return (
    <aside className="sticky top-0 z-30 bg-sidebar text-white lg:h-screen lg:w-64">
      <div className="flex h-16 items-center px-5 text-xl font-black tracking-wide">TaskFlow</div>
      <nav className="flex gap-2 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `flex min-w-fit items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition ${isActive ? "bg-white text-sidebar" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>
              <Icon size={18} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
