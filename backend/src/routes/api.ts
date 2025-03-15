import express, { Request, Response, Router } from "express";
import { login, register } from "../controllers/auth.controller";
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

// Question routes
router.get("/guess", getRandomQuestion);
router.post("/validate", validateAnswer);

// Challenge routes - protected with auth middleware
router.post("/challenge/create", authMiddleware, createChallenge);
router.get("/challenge/:id", getChallengeById);

export default router;
