import { PrismaClient } from "@prisma/client";
import { asyncHandler, sendSuccess } from "../utils/errors.js";

const prisma = new PrismaClient();

export const getDashboard = asyncHandler(async (req, res) => {
  const projectWhere = req.user.role === "ADMIN" ? {} : { members: { some: { userId: req.user.id } } };
  const taskWhere = req.user.role === "ADMIN" ? {} : { OR: [{ assigneeId: req.user.id }, { project: projectWhere }] };
  const now = new Date();

  const [totalProjects, totalTasks, grouped, overdueTasks, myTasks, recentTasks] = await Promise.all([
    prisma.project.count({ where: projectWhere }),
    prisma.task.count({ where: taskWhere }),
    prisma.task.groupBy({ by: ["status"], where: taskWhere, _count: { status: true } }),
    prisma.task.findMany({
      where: { ...taskWhere, dueDate: { lt: now }, status: { not: "DONE" } },
      include: { project: { select: { id: true, name: true } }, assignee: { select: { id: true, name: true } } },
      orderBy: { dueDate: "asc" },
      take: 10
    }),
    prisma.task.findMany({
      where: { assigneeId: req.user.id },
      include: { project: { select: { id: true, name: true } }, assignee: { select: { id: true, name: true } } },
      orderBy: { dueDate: "asc" },
      take: 20
    }),
    prisma.task.findMany({
      where: taskWhere,
      include: { project: { select: { id: true, name: true } }, createdBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 8
    })
  ]);

  const tasksByStatus = { TODO: 0, IN_PROGRESS: 0, IN_REVIEW: 0, DONE: 0 };
  grouped.forEach((item) => {
    tasksByStatus[item.status] = item._count.status;
  });

  const recentActivity = recentTasks.map((task) => ({
    id: task.id,
    text: `${task.createdBy.name} created ${task.title}`,
    createdAt: task.createdAt,
    project: task.project.name
  }));

  sendSuccess(res, { totalProjects, totalTasks, tasksByStatus, overdueTasks, myTasks, recentActivity }, "Dashboard fetched");
});
