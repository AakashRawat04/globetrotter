import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
	challengeService,
	questionService,
	userService,
} from "../services/db.service";

export const getRandomQuestion = async (req: AuthRequest, res: Response) => {
	try {
		// Only authenticated users can get questions
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const question = await questionService.getRandomQuestion();

		if (!question) {
			return res.status(500).json({ message: "Failed to fetch question" });
		}

		// Return only necessary fields
		res.status(200).json({
			qbid: question.qbid,
			clues: question.clues,
			fun_fact: question.fun_fact,
			trivia: question.trivia,
		});
	} catch (error) {
		console.error("Error fetching random question:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const giveup = async (req: AuthRequest, res: Response) => {
	try {
		// Only authenticated users can give up
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { qbid, challengeCode } = req.body;
		const { userid } = req.user;

		if (!qbid) {
			return res.status(400).json({ message: "Question ID is required" });
		}

		// Get the question to return the correct answer
		const question = await questionService.getQuestionById(qbid);

		if (!question) {
			return res.status(404).json({ message: "Question not found" });
		}

		// Get current user stats
		const user = await userService.getUserById(userid);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Update loss count
		const updatedLoss = user.loss + 1;

		// Update user stats in database
		await userService.updateUserStats(userid, user.wins, updatedLoss);

		// If this is part of a challenge, also update challenge stats
		if (challengeCode) {
			// Get existing challenge record for user
			const challengeRecords = await challengeService.getChallengeByCode(
				challengeCode
			);

			if (challengeRecords) {
				// Find if user already has a record for this challenge
				const userRecord = challengeRecords.find(
					(record) => record.userid === userid
				);

				if (userRecord) {
					// Update existing record with an additional loss
					await challengeService.updateChallengeStats(
						challengeCode,
						userid,
						userRecord.wins,
						userRecord.loss + 1
					);
				} else {
					// Create new record for user in this challenge
					await challengeService.addUserToChallenge(
						challengeCode,
						userid,
						0,
						1
					);
				}
			}
		}

		res.status(200).json({
			data: {
				wins: user.wins,
				loss: updatedLoss,
				correctAnswer: question.city,
			},
		});
	} catch (error) {
		console.error("Error processing give up:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const validateAnswer = async (req: AuthRequest, res: Response) => {
	try {
		// Only authenticated users can validate answers
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { qbid, answer, challengeCode } = req.body;
		const { userid } = req.user;

		if (!qbid || !answer) {
			return res
				.status(400)
				.json({ message: "Question ID and answer are required" });
		}

		const isCorrect = await questionService.validateAnswer(qbid, answer);

		// Get current user stats
		const user = await userService.getUserById(userid);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Update stats based on correctness
		const updatedWins = isCorrect ? user.wins + 1 : user.wins;
		const updatedLoss = isCorrect ? user.loss : user.loss + 1;

		// Update user stats in database
		await userService.updateUserStats(userid, updatedWins, updatedLoss);

		// Response data defaults to user's overall stats
		let responseData = {
			wins: updatedWins,
			loss: updatedLoss,
		};

		// If this is part of a challenge, also update challenge stats
		if (challengeCode) {
			// Get existing challenge record for user
			const challengeRecords = await challengeService.getChallengeByCode(
				challengeCode
			);

			if (challengeRecords) {
				// Find if user already has a record for this challenge
				const userRecord = challengeRecords.find(
					(record) => record.userid === userid
				);

				let challengeWins = 0;
				let challengeLoss = 0;

				if (userRecord) {
					// Update existing record
					challengeWins = isCorrect ? userRecord.wins + 1 : userRecord.wins;
					challengeLoss = isCorrect ? userRecord.loss : userRecord.loss + 1;
					await challengeService.updateChallengeStats(
						challengeCode,
						userid,
						challengeWins,
						challengeLoss
					);
				} else {
					// Create new record for user in this challenge
					challengeWins = isCorrect ? 1 : 0;
					challengeLoss = isCorrect ? 0 : 1;
					await challengeService.addUserToChallenge(
						challengeCode,
						userid,
						challengeWins,
						challengeLoss
					);
				}

				// If challenge code is provided, return challenge-specific stats
				responseData = {
					wins: challengeWins,
					loss: challengeLoss,
				};
			}
		}

		res.status(200).json({
			correct: isCorrect,
			data: responseData,
		});
	} catch (error) {
		console.error("Error validating answer:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
