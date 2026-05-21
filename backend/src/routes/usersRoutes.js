import { Router } from "express";
import { listUsers } from "../controllers/usersController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();
router.get("/", authenticate, requireRole("ADMIN"), listUsers);
export default router;
