import { X } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "../lib/utils";

export function Button({ className, variant = "primary", ...props }) {
  const variants = {
    primary: "bg-primary text-white hover:bg-indigo-500",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
    danger: "bg-red-600 text-white hover:bg-red-500"
  };
  return <button className={cn("inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60", variants[variant], className)} {...props} />;
}

export function Input({ className, error, ...props }) {
  return (
    <div className="space-y-1">
      <input className={cn("h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-indigo-100", className)} {...props} />
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

export function Textarea({ className, error, ...props }) {
  return (
    <div className="space-y-1">
      <textarea className={cn("min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-indigo-100", className)} {...props} />
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

export function Select({ className, error, children, ...props }) {
  return (
    <div className="space-y-1">
      <select className={cn("h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-indigo-100", className)} {...props}>
        {children}
      </select>
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

export const Card = forwardRef(function Card({ className, ...props }, ref) {
  return <div ref={ref} className={cn("rounded-lg border border-slate-200 bg-white shadow-soft", className)} {...props} />;
});

export function Badge({ className, children }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", className)}>{children}</span>;
}

export function Avatar({ name }) {
  return <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">{name}</span>;
}

export function Dialog({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-950">{title}</h2>
          <button className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Spinner({ label = "Loading" }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-sm font-medium text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
      {label}
    </div>
  );
}

export function EmptyState({ title, action }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="font-semibold text-slate-700">{title}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
