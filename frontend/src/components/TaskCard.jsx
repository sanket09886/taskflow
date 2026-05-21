import { useDraggable } from "@dnd-kit/core";
import { Calendar } from "lucide-react";
import { formatDate, initials, isOverdue } from "../lib/utils";
import { PriorityBadge } from "./status";
import { Avatar, Card } from "./ui";

export default function TaskCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  return (
    <Card ref={setNodeRef} style={style} className={`cursor-grab p-4 transition hover:-translate-y-0.5 hover:shadow-lg ${isDragging ? "opacity-70" : ""}`} {...listeners} {...attributes} onClick={onClick}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-950">{task.title}</h3>
          <PriorityBadge priority={task.priority} />
        </div>
        <div className={`flex items-center gap-2 text-xs font-semibold ${isOverdue(task) ? "text-red-600" : "text-slate-500"}`}>
          <Calendar size={14} />
          {formatDate(task.dueDate)}
        </div>
        <div className="flex items-center gap-2">
          <Avatar name={initials(task.assignee?.name || "Unassigned")} />
          <span className="truncate text-xs font-medium text-slate-600">{task.assignee?.name || "Unassigned"}</span>
        </div>
      </div>
    </Card>
  );
}
