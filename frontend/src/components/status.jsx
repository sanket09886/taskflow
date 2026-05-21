import { Badge } from "./ui";

export const STATUSES = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
export const statusLabels = { TODO: "TODO", IN_PROGRESS: "IN PROGRESS", IN_REVIEW: "IN REVIEW", DONE: "DONE" };

const statusClasses = {
  TODO: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  IN_REVIEW: "bg-yellow-100 text-yellow-800",
  DONE: "bg-green-100 text-green-700"
};

const priorityClasses = {
  LOW: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-700"
};

export const StatusBadge = ({ status }) => <Badge className={statusClasses[status]}>{statusLabels[status] || status}</Badge>;
export const PriorityBadge = ({ priority }) => <Badge className={priorityClasses[priority]}>{priority}</Badge>;
