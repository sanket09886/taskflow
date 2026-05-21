import { X } from "lucide-react";
import { useState } from "react";
import { updateTask } from "../api/tasks";
import { formatDate } from "../lib/utils";
import { PriorityBadge, StatusBadge } from "./status";
import { Button, Input, Select, Textarea } from "./ui";

export default function TaskDrawer({ task, members, isAdmin, onClose, onUpdated }) {
  const [form, setForm] = useState(() => ({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "TODO",
    priority: task?.priority || "MEDIUM",
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
    assigneeId: task?.assigneeId || ""
  }));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  if (!task) return null;

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await updateTask(task.id, form);
      onUpdated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40">
      <aside className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">{task.project?.name}</p>
            <h2 className="text-2xl font-black text-slate-950">{task.title}</h2>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Close task details">
            <X size={20} />
          </button>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{formatDate(task.dueDate)}</span>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
          <label className="block space-y-1 text-sm font-semibold text-slate-700">
            Title
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} disabled={!isAdmin && task.assigneeId !== task.assignee?.id} />
          </label>
          <label className="block space-y-1 text-sm font-semibold text-slate-700">
            Description
            <Textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              Status
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="IN_REVIEW">IN REVIEW</option>
                <option value="DONE">DONE</option>
              </Select>
            </label>
            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              Priority
              <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} disabled={!isAdmin}>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </Select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              Assignee
              <Select value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })} disabled={!isAdmin}>
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member.userId} value={member.userId}>{member.user.name}</option>
                ))}
              </Select>
            </label>
            <label className="block space-y-1 text-sm font-semibold text-slate-700">
              Due date
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} disabled={!isAdmin} />
            </label>
          </div>
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
        </form>
      </aside>
    </div>
  );
}
