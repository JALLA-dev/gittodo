import { Router } from "express";
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTask,
  updateSubtask,
  reorderTasks,
  batchTasks,
  getStats,
  exportTasks,
} from "../controllers/taskController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

// Apply auth middleware to all task routes
router.use(requireAuth);

// Collection routes
router.get("/", getTasks);
router.post("/", createTask);
router.get("/stats", getStats);
router.get("/export", exportTasks);
router.patch("/reorder", reorderTasks);
router.post("/batch", batchTasks);

// Individual task routes
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/toggle", toggleTask);
router.patch("/:id/subtask", updateSubtask);

export default router;
