import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middlewares/auth.middleware";
import { userService } from "../services/db.service";

export const register = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Check if user already exists
		const existingUser = await userService.getUserByUsername(username);
		if (existingUser) {
			return res.status(409).json({ message: "Username already exists" });
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create user
		const newUser = await userService.createUser({
			username,
			password: hashedPassword,
			wins: 0,
			loss: 0,
		});

		if (!newUser) {
			return res.status(500).json({ message: "Failed to create user" });
		}

		// Generate JWT
		const token = jwt.sign(
			{ userid: newUser.userid, username: newUser.username },
			process.env.JWT_SECRET || "default_secret",
			{ expiresIn: "7d" }
		);

		res.status(201).json({
			message: "User registered successfully",
			token,
			user: {
				userid: newUser.userid,
				username: newUser.username,
				wins: newUser.wins,
				loss: newUser.loss,
			},
		});
	} catch (error) {
		console.error("Registration error:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res
				.status(400)
				.json({ message: "Username and password are required" });
		}

		// Find user
		const user = await userService.getUserByUsername(username);
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.password || "");
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// Generate JWT
		const token = jwt.sign(
			{ userid: user.userid, username: user.username },
			process.env.JWT_SECRET || "default_secret",
			{ expiresIn: "7d" }
		);

		res.status(200).json({
			message: "Login successful",
			token,
			user: {
				userid: user.userid,
				username: user.username,
				wins: user.wins,
				loss: user.loss,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
	try {
		// The user ID should be available from the auth middleware
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const userId = req.user.userid;

		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Fetch user details
		const user = await userService.getUserById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Return user profile without sensitive information
		res.status(200).json({
			user: {
				userid: user.userid,
				username: user.username,
				wins: user.wins,
				loss: user.loss,
			},
		});
	} catch (error) {
		console.error("Get user profile error:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const updateUserStats = async (req: AuthRequest, res: Response) => {
	try {
		const user = req.user; // From auth middleware
		if (!user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const userid = user.userid;
		const { wins, losses } = req.body;

		if (wins === undefined || losses === undefined) {
			return res.status(400).json({ message: "Wins and losses are required" });
		}

		// Update the user stats
		const updatedUser = await userService.updateUserStats(userid, wins, losses);

		if (!updatedUser) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({
			message: "User stats updated successfully",
			data: updatedUser,
		});
	} catch (error) {
		console.error("Error updating user stats:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
