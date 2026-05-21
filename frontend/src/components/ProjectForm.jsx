import { useState } from "react";
import { Button, Input, Textarea } from "./ui";

export default function ProjectForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ name: "", description: "", deadline: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = "Project name is required";
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
      <Input placeholder="Project name" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create project"}</Button>
      </div>
    </form>
  );
}
