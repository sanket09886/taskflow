import { useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { getDashboard } from "../api/dashboard";
import { Card, EmptyState, Spinner } from "../components/ui";
import { StatusBadge } from "../components/status";
import { formatDate, isOverdue } from "../lib/utils";

const colors = { TODO: "#94A3B8", IN_PROGRESS: "#3B82F6", IN_REVIEW: "#EAB308", DONE: "#22C55E" };

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Dashboard could not load"))
      .finally(() => setLoading(false));
  }, []);

  const chartData = useMemo(() => Object.entries(data?.tasksByStatus || {}).map(([name, value]) => ({ name, value })), [data]);
  if (loading) return <Spinner label="Loading dashboard" />;
  if (error) return <EmptyState title={error} />;

  const done = data.tasksByStatus.DONE || 0;
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total Projects" value={data.totalProjects} />
        <Stat label="My Tasks" value={data.myTasks.length} />
        <Stat label="Overdue" value={data.overdueTasks.length} danger />
        <Stat label="Done" value={done} />
      </section>
      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card className="p-5">
          <h2 className="mb-4 text-lg font-black">Tasks by status</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" innerRadius={70} outerRadius={100} paddingAngle={3}>
                  {chartData.map((entry) => <Cell key={entry.name} fill={colors[entry.name]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-black">My assigned tasks</h2>
          </div>
          {data.myTasks.length === 0 ? <EmptyState title="No assigned tasks yet." /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr><th className="p-4">Task</th><th className="p-4">Status</th><th className="p-4">Project</th><th className="p-4">Due date</th></tr>
                </thead>
                <tbody>
                  {data.myTasks.map((task) => (
                    <tr key={task.id} className={`border-t border-slate-100 ${isOverdue(task) ? "bg-red-50" : ""}`}>
                      <td className="p-4 font-semibold">{task.title}</td>
                      <td className="p-4"><StatusBadge status={task.status} /></td>
                      <td className="p-4 text-slate-600">{task.project.name}</td>
                      <td className={`p-4 font-medium ${isOverdue(task) ? "text-red-600" : "text-slate-600"}`}>{formatDate(task.dueDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}

function Stat({ label, value, danger }) {
  return (
    <Card className="p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-black ${danger ? "text-red-600" : "text-slate-950"}`}>{value}</p>
    </Card>
  );
}
