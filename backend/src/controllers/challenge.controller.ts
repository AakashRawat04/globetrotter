import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { challengeService } from "../services/db.service";

export const createChallenge = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { userid } = req.user;

		const challenge = await challengeService.createChallenge(userid);

		if (!challenge) {
			return res.status(500).json({ message: "Failed to create challenge" });
		}

		res.status(201).json({
			message: "Challenge created successfully",
			challenge,
		});
	} catch (error) {
		console.error("Error creating challenge:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getChallengeById = async (req: AuthRequest, res: Response) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ message: "Challenge ID is required" });
		}

		const challengeRecords = await challengeService.getChallengeById(id);

		if (!challengeRecords) {
			return res.status(404).json({ message: "Challenge not found" });
		}

		res.status(200).json({
			message: "Challenge retrieved successfully",
			participants: challengeRecords,
		});
	} catch (error) {
		console.error("Error fetching challenge:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
