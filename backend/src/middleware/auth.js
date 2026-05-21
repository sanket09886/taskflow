import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/errors.js";
import { verifyToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

export const authenticate = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new ApiError(401, "Authorization token is required");
    }

    const token = header.split(" ")[1];
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    if (!user) throw new ApiError(401, "Invalid or expired token");
    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new ApiError(401, "Invalid or expired token"));
  }
};
