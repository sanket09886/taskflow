import { PrismaClient } from "@prisma/client";
import { ApiError, asyncHandler, notFound, sendSuccess } from "../utils/errors.js";

const prisma = new PrismaClient();

const includeProject = {
  members: { include: { user: { select: { id: true, name: true, email: true, role: true } } } },
  tasks: {
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true, email: true } }
    },
    orderBy: { createdAt: "desc" }
  }
};

export const listProjects = asyncHandler(async (req, res) => {
  const projects = await prisma.project.findMany({
    where: req.user.role === "ADMIN" ? {} : { members: { some: { userId: req.user.id } } },
    include: { _count: { select: { tasks: true, members: true } } },
    orderBy: { createdAt: "desc" }
  });
  sendSuccess(res, projects, "Projects fetched");
});

export const createProject = asyncHandler(async (req, res) => {
  const { name, description, deadline } = req.body;
  const project = await prisma.project.create({
    data: {
      name,
      description,
      deadline: deadline ? new Date(deadline) : null,
      members: { create: { userId: req.user.id, role: "ADMIN" } }
    },
    include: includeProject
  });
  sendSuccess(res, project, "Project created", 201);
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id }, include: includeProject });
  if (!project) throw notFound("Project");
  if (req.user.role !== "ADMIN" && !project.members.some((member) => member.userId === req.user.id)) {
    throw new ApiError(403, "You are not a member of this project");
  }
  sendSuccess(res, project, "Project fetched");
});

export const updateProject = asyncHandler(async (req, res) => {
  const { name, description, deadline } = req.body;
  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: { name, description, deadline: deadline ? new Date(deadline) : null },
    include: includeProject
  });
  sendSuccess(res, project, "Project updated");
});

export const deleteProject = asyncHandler(async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  sendSuccess(res, null, "Project deleted");
});

export const addMember = asyncHandler(async (req, res) => {
  const { userId, role = "MEMBER" } = req.body;
  const project = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!project) throw notFound("Project");

  const member = await prisma.projectMember.create({
    data: { userId, projectId: req.params.id, role },
    include: { user: { select: { id: true, name: true, email: true, role: true } } }
  });
  sendSuccess(res, member, "Member added", 201);
});

export const removeMember = asyncHandler(async (req, res) => {
  await prisma.projectMember.delete({
    where: { userId_projectId: { userId: req.params.userId, projectId: req.params.id } }
  });
  sendSuccess(res, null, "Member removed");
});
