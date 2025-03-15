import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userService } from "../services/db.service";

export const register = async (req: Request, res: Response) => {
	try {
		const { username, email, password } = req.body;

		if (!username || !email || !password) {
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
