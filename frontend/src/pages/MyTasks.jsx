import { useEffect, useState } from "react";
import { getDashboard } from "../api/dashboard";
import { Card, EmptyState, Spinner } from "../components/ui";
import { StatusBadge, PriorityBadge } from "../components/status";
import { formatDate, isOverdue } from "../lib/utils";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((res) => setTasks(res.data.myTasks))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading my tasks" />;
  if (tasks.length === 0) return <EmptyState title="No tasks assigned to you yet." />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-950">My Tasks</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tasks.map((task) => (
          <Card key={task.id} className={`p-5 ${isOverdue(task) ? "border-red-200 bg-red-50" : ""}`}>
            <h2 className="text-lg font-black">{task.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{task.project.name}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
            <p className={`mt-4 text-sm font-semibold ${isOverdue(task) ? "text-red-600" : "text-slate-600"}`}>{formatDate(task.dueDate)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
