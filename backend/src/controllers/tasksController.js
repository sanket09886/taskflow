import { PrismaClient } from "@prisma/client";
import { ApiError, asyncHandler, notFound, sendSuccess } from "../utils/errors.js";

const prisma = new PrismaClient();
const includeTask = {
  assignee: { select: { id: true, name: true, email: true } },
  createdBy: { select: { id: true, name: true, email: true } },
  project: { select: { id: true, name: true } }
};

const canAccessProject = async (user, projectId) => {
  if (user.role === "ADMIN") return true;
  const member = await prisma.projectMember.findUnique({ where: { userId_projectId: { userId: user.id, projectId } } });
  return Boolean(member);
};

export const listProjectTasks = asyncHandler(async (req, res) => {
  if (!(await canAccessProject(req.user, req.params.id))) throw new ApiError(403, "Project access required");
  const tasks = await prisma.task.findMany({
    where: { projectId: req.params.id },
    include: includeTask,
    orderBy: { createdAt: "desc" }
  });
  sendSuccess(res, tasks, "Tasks fetched");
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, assigneeId } = req.body;
  const project = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!project) throw notFound("Project");

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId: req.params.id,
      assigneeId: assigneeId || null,
      createdById: req.user.id
    },
    include: includeTask
  });
  sendSuccess(res, task, "Task created", 201);
});

export const updateTask = asyncHandler(async (req, res) => {
  const existing = await prisma.task.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound("Task");
  if (req.user.role !== "ADMIN" && existing.assigneeId !== req.user.id) {
    throw new ApiError(403, "Only admins or the assignee can update this task");
  }

  const { title, description, status, priority, dueDate, assigneeId } = req.body;
  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      assigneeId: assigneeId === undefined ? undefined : assigneeId || null
    },
    include: includeTask
  });
  sendSuccess(res, task, "Task updated");
});

export const deleteTask = asyncHandler(async (req, res) => {
  await prisma.task.delete({ where: { id: req.params.id } });
  sendSuccess(res, null, "Task deleted");
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const existing = await prisma.task.findUnique({ where: { id: req.params.id } });
  if (!existing) throw notFound("Task");
  if (req.user.role !== "ADMIN" && existing.assigneeId !== req.user.id) {
    throw new ApiError(403, "Only admins or the assignee can update status");
  }

  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: { status: req.body.status },
    include: includeTask
  });
  sendSuccess(res, task, "Task status updated");
});
