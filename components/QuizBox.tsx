"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCorrectAnswer, validateAnswer } from "@/services/api.service";
import useAuthStore from "@/store/useAuthStore";
import useGameStore from "@/store/useGameStore";
import { RefreshCw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import TriviaBox from "./TriviaBox";
import { Input } from "./ui/input";

interface QuizBoxProps {
	userName: string;
	clues: string[];
	trivia: string[];
	qbid: string;
}

const QuizBox: React.FC<QuizBoxProps> = ({ userName, clues, trivia, qbid }) => {
	const [guess, setGuess] = useState("");
	const [currentClueIndex, setCurrentClueIndex] = useState(0);
	const [answerStatus, setAnswerStatus] = useState<
		"waiting" | "correct" | "incorrect" | "gave-up"
	>("waiting");
	const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
	const { token } = useAuthStore();
	const { setWins, setLoss } = useGameStore();

	// guess button click handler
	const handleGuessClick = async () => {
		// Handle guess button click logic here
		const response = await validateAnswer(qbid, guess, token!);
		if (!response) {
			console.error("Error validating answer");
			return;
		}

		console.log("Response from validateAnswer:", response);
		setWins(response.data.wins);
		setLoss(response.data.loss);

		if (response.correct) {
			setAnswerStatus("correct");
			// Correct answer logic
		} else {
			setAnswerStatus("incorrect");
			// Incorrect answer logic
		}
	};

	// rephrase button click handler to cycle through clues
	const handleRephrase = () => {
		// Move to the next clue in the array, or cycle back to the beginning
		setCurrentClueIndex((prevIndex) => (prevIndex + 1) % clues.length);
	};

	// handle giving up to see the correct answer
	const handleGiveUp = async () => {
		const response = await getCorrectAnswer(qbid, token!);
		if (!response) {
			console.error("Error getting correct answer");
			return;
		}

		console.log("Response from getCorrectAnswer:", response);

		setCorrectAnswer(response.data.correctAnswer);
		setLoss(response.data.loss);
		setAnswerStatus("gave-up");
	};

	return (
		<div className="flex flex-row items-center justify-center gap-10 md:gap-16 w-full max-w-7xl mx-auto">
			<TriviaBox
				clueText={trivia[0]}
				className="hidden md:block flex-shrink-0"
			/>

			{/* Quiz Card */}
			<Card className="w-full max-w-xl mx-auto bg-black/70 text-white border-none p-2">
				<CardHeader className="p-6">
					<div className="text-center mb-4">
						<h3 className="text-2xl font-bold text-amber-400">
							Hello, {userName}!
						</h3>
					</div>
					<CardTitle className="text-xl font-bold text-center">
						{clues[currentClueIndex] || "No clues available"}
					</CardTitle>
					<div className="flex justify-center mt-4">
						<Button
							variant="outline"
							size="lg"
							className="bg-transparent text-white border-white hover:bg-white/20 hover:text-white text-base"
							onClick={handleRephrase}
						>
							<RefreshCw className={`mr-2 h-5 w-5`} />
							Rephrase
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-6 p-6">
					{/* Display different images based on answer status */}
					<div className="flex justify-center mb-2">
						{answerStatus === "waiting" && (
							<Image
								width={120}
								height={120}
								src="/images/waiting.png"
								alt="Waiting"
							/>
						)}
						{answerStatus === "correct" && (
							<Image
								width={120}
								height={120}
								src="/images/correct.png"
								alt="Correct"
							/>
						)}
						{answerStatus === "incorrect" && (
							<Image
								width={220}
								height={220}
								src="/images/aww-hell-nah.png"
								alt="Incorrect"
							/>
						)}
						{answerStatus === "gave-up" && (
							<div className="text-center">
								<Image
									width={120}
									height={120}
									src="/images/giveup.png"
									alt="Gave Up"
									className="mx-auto"
								/>
								<div className="mt-4 p-3 bg-red-900/50 rounded-md">
									<p className="text-gray-300 mb-1">The correct answer was:</p>
									<p className="text-xl font-bold text-amber-400">
										{correctAnswer}
									</p>
								</div>
							</div>
						)}
					</div>
					{/* Answer input with guess button */}
					<div className="flex flex-col gap-4">
						{answerStatus === "waiting" || answerStatus === "incorrect" ? (
							<>
								<div className="flex items-center gap-3">
									<Input
										className="flex-1 h-12 text-lg"
										placeholder="Your answer..."
										value={guess}
										onChange={(e) => setGuess(e.target.value)}
									/>
									<Button
										variant="default"
										className="bg-amber-500 hover:bg-amber-600 text-black h-12 text-lg px-6"
										onClick={handleGuessClick}
									>
										Guess
									</Button>
								</div>
								<div className="flex gap-3">
									<Button
										variant="outline"
										className="bg-transparent text-white border-white hover:bg-white/20 hover:text-white text-base flex-1"
										onClick={() => window.location.reload()}
									>
										Next Question
									</Button>
									<Button
										variant="outline"
										className="bg-transparent text-red-400 border-red-400 hover:bg-red-800/30 hover:text-red-300 text-base flex-1"
										onClick={handleGiveUp}
									>
										Give Up
									</Button>
								</div>
							</>
						) : (
							<Button
								variant="outline"
								className="bg-transparent text-white border-white hover:bg-white/20 hover:text-white text-base w-full"
								onClick={() => window.location.reload()}
							>
								Next Question
							</Button>
						)}
					</div>
				</CardContent>
			</Card>

			<TriviaBox clueText={trivia[1]} className="md:block flex-shrink-0" />
		</div>
	);
};

export default QuizBox;
