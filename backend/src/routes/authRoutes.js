// root/backend/src/routes/authRoutes.js
import { Router } from "express";
import { register, login, logout, getProfile } from "../controllers/authController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = Router();

// routes for register, login & logout
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/myprofile", authenticateJWT, getProfile)

export default router;