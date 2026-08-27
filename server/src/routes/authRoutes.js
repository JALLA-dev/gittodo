import { Router } from "express";
import { register, login, demo, logout, getMe } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/demo", demo);
router.post("/logout", logout);
router.get("/me", requireAuth, getMe);

export default router;
