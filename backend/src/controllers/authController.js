import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { ApiError, asyncHandler, sendSuccess } from "../utils/errors.js";
import { signToken } from "../utils/jwt.js";

const prisma = new PrismaClient();
const userSelect = { id: true, name: true, email: true, role: true, createdAt: true };

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, "Email is already registered");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: userSelect
  });

  const token = signToken(user);
  sendSuccess(res, { token, user }, "Registration successful", 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, "Invalid email or password");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new ApiError(401, "Invalid email or password");

  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
  const token = signToken(safeUser);
  sendSuccess(res, { token, user: safeUser }, "Login successful");
});

export const me = asyncHandler(async (req, res) => {
  sendSuccess(res, req.user, "Current user fetched");
});
