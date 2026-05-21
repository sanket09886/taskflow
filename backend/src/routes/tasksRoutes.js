import { Router } from "express";
import { body, param } from "express-validator";
import { deleteTask, updateTask, updateTaskStatus } from "../controllers/tasksController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";

const router = Router();
const taskId = param("id").isUUID().withMessage("Task id must be a UUID");

router.use(authenticate);
router.put(
  "/:id",
  taskId,
  body("title").optional().trim().isLength({ min: 2 }),
  body("description").optional({ nullable: true }).trim().isLength({ max: 1500 }),
  body("status").optional().isIn(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
  body("priority").optional().isIn(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  body("dueDate").optional({ nullable: true }).isISO8601(),
  body("assigneeId").optional({ nullable: true }).isUUID(),
  validate,
  updateTask
);
router.delete("/:id", requireRole("ADMIN"), taskId, validate, deleteTask);
router.patch("/:id/status", taskId, body("status").isIn(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]), validate, updateTaskStatus);

export default router;
