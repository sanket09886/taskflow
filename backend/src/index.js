import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import projectsRoutes from "./routes/projectsRoutes.js";
import tasksRoutes from "./routes/tasksRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = new Set([
  frontendUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://taskflow-production-a0db.up.railway.app"
]);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  return /^https:\/\/[a-z0-9-]+\.up\.railway\.app$/i.test(origin);
};

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" }, message: "TaskFlow API is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, data: null, message: "Route not found" });
});

app.use((error, _req, res, _next) => {
  let statusCode = error.statusCode || 500;
  let message = statusCode === 500 ? "Internal server error" : error.message;
  if (error.code === "P2002") {
    statusCode = 409;
    message = "A record with this value already exists";
  }
  if (error.code === "P2025") {
    statusCode = 404;
    message = "Resource not found";
  }
  if (statusCode === 500) console.error(error);
  res.status(statusCode).json({ success: false, data: null, message });
});

app.listen(port, () => {
  console.log(`TaskFlow API running on port ${port}`);
});
