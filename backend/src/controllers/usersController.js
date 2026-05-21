import { PrismaClient } from "@prisma/client";
import { asyncHandler, sendSuccess } from "../utils/errors.js";

const prisma = new PrismaClient();

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { name: "asc" }
  });
  sendSuccess(res, users, "Users fetched");
});
