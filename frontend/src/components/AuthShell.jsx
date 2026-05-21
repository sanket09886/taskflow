import { CheckCircle2, KanbanSquare, ShieldCheck, Sparkles } from "lucide-react";
import LiveBackground from "./LiveBackground";

const highlights = [
  { icon: KanbanSquare, label: "Live Kanban workflow" },
  { icon: ShieldCheck, label: "Role based team access" },
  { icon: CheckCircle2, label: "Project deadlines and priorities" }
];

export default function AuthShell({ children, title, subtitle }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-white">
      <LiveBackground variant="dark" />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="hidden lg:block">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-indigo-100 shadow-2xl backdrop-blur">
            <Sparkles size={16} />
            Built for fast moving teams
          </div>
          <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-normal text-white">
            TaskFlow keeps projects, people, and deadlines moving together.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
            Plan work, assign owners, review progress, and move tasks across a focused Kanban board with a clean admin workflow.
          </p>
          <div className="mt-8 grid max-w-xl gap-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-500 text-white">
                    <Icon size={20} />
                  </span>
                  <span className="text-sm font-bold text-slate-100">{item.label}</span>
                </div>
              );
            })}
          </div>
        </section>
        <section className="mx-auto w-full max-w-md">
          <div className="mb-6 text-center lg:hidden">
            <h1 className="text-3xl font-black">TaskFlow</h1>
            <p className="mt-2 text-sm text-slate-300">Team task manager</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/95 p-7 text-slate-950 shadow-[0_30px_100px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-8">
            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-lg font-black text-white shadow-lg shadow-indigo-500/30">
                TF
              </div>
              <h2 className="text-2xl font-black text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
