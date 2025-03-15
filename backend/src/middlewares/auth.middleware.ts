import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
	user?: {
		userid: string;
		username: string;
	};
}

export const authMiddleware = (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "default_secret"
		) as {
			userid: string;
			username: string;
		};

		req.user = decoded;
		next();
	} catch (error) {
		console.error("Auth error:", error);
		return res.status(401).json({ message: "Unauthorized" });
	}
};
