import { Request, Response } from "express";
import { questionService } from "../services/db.service";

export const getRandomQuestion = async (req: Request, res: Response) => {
	try {
		const question = await questionService.getRandomQuestion();

		if (!question) {
			return res.status(404).json({ message: "No questions found" });
		}

		// Send question without revealing the city/country answer
		const { city, country, ...clueData } = question;
		console.log("random question city/country is: ", `${city}, ${country}`);
		console.log("random question clues are: ", clueData);

		res.status(200).json({
			message: "Random question retrieved",
			question: {
				qbid: question.qbid,
				clues: question.clues,
				// Don't send city/country as they are the answers
			},
		});
	} catch (error) {
		console.error("Error getting random question:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const validateAnswer = async (req: Request, res: Response) => {
	try {
		const { qbid, answer } = req.body;

		if (!qbid || !answer) {
			return res
				.status(400)
				.json({ message: "Question ID and answer are required" });
		}

		// The answer should be validated against city or country
		const isCorrect = await questionService.validateAnswer(qbid, answer);

		res.status(200).json({
			message: isCorrect ? "Correct answer!" : "Incorrect answer",
			correct: isCorrect,
		});
	} catch (error) {
		console.error("Error validating answer:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
