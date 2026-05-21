import { Router } from "express";
import { body, param } from "express-validator";
import {
  addMember,
  createProject,
  deleteProject,
  getProject,
  listProjects,
  removeMember,
  updateProject
} from "../controllers/projectsController.js";
import { createTask, listProjectTasks } from "../controllers/tasksController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";

const router = Router();
const idParam = param("id").isUUID().withMessage("Project id must be a UUID");
const projectBody = [
  body("name").trim().isLength({ min: 2 }).withMessage("Project name must be at least 2 characters"),
  body("description").optional({ nullable: true }).trim().isLength({ max: 1000 }).withMessage("Description is too long"),
  body("deadline").optional({ nullable: true }).isISO8601().withMessage("Deadline must be a valid date")
];

router.use(authenticate);
router.get("/", listProjects);
router.post("/", requireRole("ADMIN"), projectBody, validate, createProject);
router.get("/:id", idParam, validate, getProject);
router.put("/:id", requireRole("ADMIN"), idParam, projectBody, validate, updateProject);
router.delete("/:id", requireRole("ADMIN"), idParam, validate, deleteProject);
router.post(
  "/:id/members",
  requireRole("ADMIN"),
  idParam,
  body("userId").isUUID().withMessage("User id must be a UUID"),
  body("role").optional().isIn(["ADMIN", "MEMBER"]).withMessage("Role must be ADMIN or MEMBER"),
  validate,
  addMember
);
router.delete("/:id/members/:userId", requireRole("ADMIN"), idParam, param("userId").isUUID(), validate, removeMember);
router.get("/:id/tasks", idParam, validate, listProjectTasks);
router.post(
  "/:id/tasks",
  requireRole("ADMIN"),
  idParam,
  body("title").trim().isLength({ min: 2 }).withMessage("Task title must be at least 2 characters"),
  body("description").optional({ nullable: true }).trim().isLength({ max: 1500 }).withMessage("Description is too long"),
  body("status").optional().isIn(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
  body("priority").optional().isIn(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  body("dueDate").optional({ nullable: true }).isISO8601(),
  body("assigneeId").optional({ nullable: true }).isUUID(),
  validate,
  createTask
);

export default router;
