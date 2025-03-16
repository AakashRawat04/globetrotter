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

export const getChallengeByCode = async (req: AuthRequest, res: Response) => {
	try {
		const { code } = req.params;

		if (!code) {
			return res.status(400).json({ message: "Challenge code is required" });
		}

		const challengeRecords = await challengeService.getChallengeByCode(code);

		if (!challengeRecords) {
			return res.status(404).json({ message: "Challenge not found" });
		}

		// If user is authenticated, check if they are already part of this challenge
		if (req.user) {
			const { userid } = req.user;
			const existingRecord = challengeRecords.find(
				(record) => record.userid === userid
			);

			// If user is not part of this challenge yet, add them
			if (!existingRecord) {
				await challengeService.addUserToChallenge(code, userid, 0, 0);

				// Refetch the updated records
				const updatedRecords = await challengeService.getChallengeByCode(code);
				if (updatedRecords) {
					return res.status(200).json({
						message: "Challenge retrieved successfully and user added",
						participants: updatedRecords,
					});
				}
			}
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
