import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/errors.js";

const prisma = new PrismaClient();

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, "You do not have permission to perform this action"));
  }
  next();
};

export const requireProjectAdmin = async (req, _res, next) => {
  try {
    if (req.user.role === "ADMIN") return next();

    const projectId = req.params.id || req.params.projectId;
    const membership = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: req.user.id, projectId } }
    });

    if (!membership || membership.role !== "ADMIN") {
      throw new ApiError(403, "Project admin permission is required");
    }
    next();
  } catch (error) {
    next(error);
  }
};
