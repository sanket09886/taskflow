import { FolderKanban, LayoutDashboard, ListTodo, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "My Tasks", icon: ListTodo }
];

export default function Sidebar() {
  return (
    <aside className="sticky top-0 z-30 border-r border-white/10 bg-sidebar/95 text-white shadow-2xl backdrop-blur-xl lg:h-screen lg:w-72">
      <div className="flex h-20 items-center gap-3 px-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-500 text-sm font-black shadow-lg shadow-indigo-500/30">TF</div>
        <div>
          <div className="text-xl font-black tracking-wide">TaskFlow</div>
          <div className="text-xs font-semibold text-slate-400">Team operations</div>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-3 pb-3 lg:block lg:space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `flex min-w-fit items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-white text-sidebar shadow-lg" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>
              <Icon size={18} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="mx-4 mt-8 hidden rounded-lg border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur lg:block">
        <Sparkles className="mb-3 text-indigo-300" size={20} />
        <p className="text-sm font-bold text-white">Focus mode</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">Move tasks, review workload, and keep project delivery visible.</p>
      </div>
    </aside>
  );
}
