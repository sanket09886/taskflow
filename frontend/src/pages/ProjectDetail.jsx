import { DndContext, useDroppable } from "@dnd-kit/core";
import { Plus, UserPlus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { addProjectMember, getProject, removeProjectMember } from "../api/projects";
import { createTask, updateTaskStatus } from "../api/tasks";
import { getUsers } from "../api/users";
import TaskCard from "../components/TaskCard";
import TaskDrawer from "../components/TaskDrawer";
import TaskForm from "../components/TaskForm";
import { STATUSES, statusLabels } from "../components/status";
import { Avatar, Badge, Button, Card, Dialog, EmptyState, Select, Spinner } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { formatDate, initials } from "../lib/utils";

export default function ProjectDetail() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taskModal, setTaskModal] = useState(false);
  const [memberModal, setMemberModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    Promise.all([getProject(id), isAdmin ? getUsers() : Promise.resolve({ data: [] })])
      .then(([projectRes, usersRes]) => {
        setProject(projectRes.data);
        setTasks(projectRes.data.tasks);
        setUsers(usersRes.data);
      })
      .catch((err) => setError(err.response?.data?.message || "Project could not load"))
      .finally(() => setLoading(false));
  }, [id, isAdmin]);

  const grouped = useMemo(() => {
    return STATUSES.reduce((acc, status) => ({ ...acc, [status]: tasks.filter((task) => task.status === status) }), {});
  }, [tasks]);

  const handleDragEnd = async ({ active, over }) => {
    if (!over) return;
    const task = tasks.find((item) => item.id === active.id);
    if (!task || task.status === over.id) return;
    const previous = tasks;
    setTasks(tasks.map((item) => item.id === task.id ? { ...item, status: over.id } : item));
    try {
      await updateTaskStatus(task.id, over.id);
    } catch {
      setTasks(previous);
    }
  };

  const addTask = async (payload) => {
    const res = await createTask(project.id, payload);
    setTasks([res.data, ...tasks]);
    setTaskModal(false);
  };

  const addMember = async (payload) => {
    const res = await addProjectMember(project.id, payload);
    setProject({ ...project, members: [...project.members, res.data] });
    setMemberModal(false);
  };

  const removeMember = async (userId) => {
    await removeProjectMember(project.id, userId);
    setProject({ ...project, members: project.members.filter((member) => member.userId !== userId) });
  };

  const updateLocalTask = (updated) => {
    setTasks(tasks.map((task) => task.id === updated.id ? updated : task));
  };

  if (loading) return <Spinner label="Loading project" />;
  if (error) return <EmptyState title={error} />;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-950">{project.name}</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">{project.description || "No description yet."}</p>
            <p className="mt-3 text-sm font-semibold text-slate-500">Deadline: {formatDate(project.deadline)}</p>
          </div>
          <div className="flex items-center gap-2">
            {project.members.slice(0, 5).map((member) => <Avatar key={member.id} name={initials(member.user.name)} />)}
            {isAdmin ? <Button onClick={() => setTaskModal(true)}><Plus size={18} /> Add Task</Button> : null}
          </div>
        </div>
      </Card>
      <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid gap-4 overflow-x-auto pb-2 lg:grid-cols-4">
            {STATUSES.map((status) => <KanbanColumn key={status} status={status} tasks={grouped[status]} onTaskClick={setSelectedTask} />)}
          </div>
        </DndContext>
        <MembersPanel project={project} isAdmin={isAdmin} onAdd={() => setMemberModal(true)} onRemove={removeMember} />
      </section>
      <Dialog open={taskModal} title="Add Task" onClose={() => setTaskModal(false)}>
        <TaskForm members={project.members} onSubmit={addTask} onCancel={() => setTaskModal(false)} />
      </Dialog>
      <Dialog open={memberModal} title="Add Member" onClose={() => setMemberModal(false)}>
        <MemberForm users={users} members={project.members} onSubmit={addMember} />
      </Dialog>
      <TaskDrawer task={selectedTask} members={project.members} isAdmin={isAdmin} onClose={() => setSelectedTask(null)} onUpdated={updateLocalTask} />
    </div>
  );
}

function KanbanColumn({ status, tasks, onTaskClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} className={`min-h-96 rounded-lg border border-slate-200 bg-slate-100 p-3 transition ${isOver ? "ring-2 ring-primary" : ""}`}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-black text-slate-700">{statusLabels[status]}</h2>
        <Badge className="bg-white text-slate-600">{tasks.length}</Badge>
      </div>
      <div className="space-y-3">
        {tasks.length === 0 ? <div className="rounded-md border border-dashed border-slate-300 p-4 text-center text-sm font-semibold text-slate-500">No tasks</div> : null}
        {tasks.map((task) => <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />)}
      </div>
    </div>
  );
}

function MembersPanel({ project, isAdmin, onAdd, onRemove }) {
  return (
    <Card className="h-fit p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black">Members</h2>
        {isAdmin ? <Button variant="secondary" onClick={onAdd}><UserPlus size={16} /></Button> : null}
      </div>
      <div className="space-y-3">
        {project.members.map((member) => (
          <div key={member.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-100 p-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={initials(member.user.name)} />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{member.user.name}</p>
                <p className="truncate text-xs text-slate-500">{member.user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={member.role === "ADMIN" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-700"}>{member.role}</Badge>
              {isAdmin ? <button onClick={() => onRemove(member.userId)} className="rounded-md p-1 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove member"><X size={16} /></button> : null}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function MemberForm({ users, members, onSubmit }) {
  const [form, setForm] = useState({ userId: "", role: "MEMBER" });
  const [saving, setSaving] = useState(false);
  const memberIds = new Set(members.map((member) => member.userId));
  const available = users.filter((user) => !memberIds.has(user.id));
  const submit = async (event) => {
    event.preventDefault();
    if (!form.userId) return;
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <Select value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })}>
        <option value="">Choose user</option>
        {available.map((user) => <option key={user.id} value={user.id}>{user.name} ({user.email})</option>)}
      </Select>
      <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="MEMBER">MEMBER</option>
        <option value="ADMIN">ADMIN</option>
      </Select>
      <Button type="submit" disabled={saving || !form.userId}>{saving ? "Adding..." : "Add member"}</Button>
    </form>
  );
}
