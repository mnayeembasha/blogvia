import express from "express";
import { zodValidate } from "../middleware/zodValidate";
import { loginZodSchema, signupZodSchema } from "../validate/zodSchema";
import { checkAuth, login, logout, signup } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/authMiddleware";
const router = express.Router();

router.post("/signup",zodValidate(signupZodSchema),signup);
router.post("/login",zodValidate(loginZodSchema),login);
router.post("/logout",authMiddleware,logout);
router.get("/check",authMiddleware,checkAuth);


export default router;