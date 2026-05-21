import { clsx } from "clsx";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs));

export const formatDate = (value) => {
  if (!value) return "No date";
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, "dd MMM yyyy");
};

export const initials = (name = "User") => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export const isOverdue = (task) => task?.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE";
