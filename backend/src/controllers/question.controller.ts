import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { questionService, userService } from "../services/db.service";

export const getRandomQuestion = async (req: AuthRequest, res: Response) => {
	try {
		const question = await questionService.getRandomQuestion();

		if (!question) {
			return res.status(404).json({ message: "No questions found" });
		}

		// Send question without revealing the city/country answer
		const { city, country, ...clueData } = question;
		console.log("random question city/country is: ", `${city}, ${country}`);
		console.log("random question clues are: ", clueData);

		res.status(200).json(clueData);
	} catch (error) {
		console.error("Error getting random question:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const validateAnswer = async (req: AuthRequest, res: Response) => {
	try {
		const { qbid, answer } = req.body;
		const { userid } = req.user!;

		if (!qbid || !answer) {
			return res
				.status(400)
				.json({ message: "Question ID and answer are required" });
		}

		// The answer should be validated against city or country
		const isCorrect = await questionService.validateAnswer(qbid, answer);

		// Update user stats if user is authenticated
		if (userid) {
			const user = await userService.getUserById(userid);
			if (user) {
				let { wins, loss } = user;

				if (isCorrect) {
					wins += 1;
				} else {
					loss += 1;
				}

				const updatedUser = await userService.updateUserStats(
					userid,
					wins,
					loss
				);

				if (updatedUser) {
					return res.status(200).json({
						message: isCorrect ? "Correct answer!" : "Incorrect answer",
						correct: isCorrect,
						data: {
							wins: updatedUser.wins,
							loss: updatedUser.loss,
						},
					});
				}
			}
		}

		// If we couldn't update user stats or user is not authenticated
		res.status(200).json({
			message: isCorrect ? "Correct answer!" : "Incorrect answer",
			correct: isCorrect,
		});
	} catch (error) {
		console.error("Error validating answer:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
