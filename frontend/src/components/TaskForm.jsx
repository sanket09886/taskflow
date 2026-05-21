import { useState } from "react";
import { Button, Input, Select, Textarea } from "./ui";

export default function TaskForm({ members, onSubmit, onCancel }) {
  const [form, setForm] = useState({ title: "", description: "", assigneeId: "", priority: "MEDIUM", dueDate: "", status: "TODO" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (form.title.trim().length < 2) nextErrors.title = "Task title is required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <Input placeholder="Task title" value={form.title} error={errors.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}>
          <option value="">Unassigned</option>
          {members.map((member) => <option key={member.userId} value={member.userId}>{member.user.name}</option>)}
        </Select>
        <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="URGENT">URGENT</option>
        </Select>
      </div>
      <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? "Adding..." : "Add task"}</Button>
      </div>
    </form>
  );
}
