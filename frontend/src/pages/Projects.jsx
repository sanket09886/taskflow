import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { createProject } from "../api/projects";
import ProjectForm from "../components/ProjectForm";
import { Button, Card, Dialog, EmptyState, Spinner } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { useProjects } from "../hooks/useProjects";
import { formatDate } from "../lib/utils";
import { useState } from "react";

export default function Projects() {
  const { isAdmin } = useAuth();
  const { projects, setProjects, loading, error } = useProjects();
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState("");

  const addProject = async (payload) => {
    setFormError("");
    try {
      const res = await createProject(payload);
      setProjects([res.data, ...projects]);
      setOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not create project");
    }
  };

  if (loading) return <Spinner label="Loading projects" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Projects</h1>
          <p className="text-sm text-slate-500">Track teams, deadlines, and task progress.</p>
        </div>
        {isAdmin ? <Button onClick={() => setOpen(true)}><Plus size={18} /> New Project</Button> : null}
      </div>
      {error ? <EmptyState title={error} /> : null}
      {!error && projects.length === 0 ? <EmptyState title="No projects yet. Create one!" action={isAdmin ? <Button onClick={() => setOpen(true)}>New Project</Button> : null} /> : null}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} to={`/projects/${project.id}`}>
            <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-lg">
              <h2 className="text-lg font-black text-slate-950">{project.name}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">{project.description || "No description yet."}</p>
              <div className="mt-6 flex items-center justify-between text-sm font-semibold text-slate-500">
                <span>{project._count?.tasks || project.tasks?.length || 0} tasks</span>
                <span>{formatDate(project.deadline)}</span>
              </div>
            </Card>
          </Link>
        ))}
      </section>
      <Dialog open={open} title="New Project" onClose={() => setOpen(false)}>
        {formError ? <p className="mb-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{formError}</p> : null}
        <ProjectForm onSubmit={addProject} onCancel={() => setOpen(false)} />
      </Dialog>
    </div>
  );
}
