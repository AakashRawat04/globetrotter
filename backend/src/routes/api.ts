import express, { Request, Response, Router } from "express";
import {
	getUserProfile,
	login,
	register,
	updateUserStats,
} from "../controllers/auth.controller";
import {
	createChallenge,
	getChallengeById,
} from "../controllers/challenge.controller";
import {
	getRandomQuestion,
	validateAnswer,
} from "../controllers/question.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router: Router = express.Router();

// Test route
router.get("/test", (req: Request, res: Response) => {
	res.json({ message: "API is working!" });
});

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/user/me", authMiddleware, getUserProfile);
router.put("/user/stats", authMiddleware, updateUserStats);

// Question routes
router.get("/guess", authMiddleware, getRandomQuestion);
router.post("/validate", authMiddleware, validateAnswer);

// Challenge routes - protected with auth middleware
router.post("/challenge/create", authMiddleware, createChallenge);
router.get("/challenge/:id", getChallengeById);

export default router;
