"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import ClueBox from "./ClueBox";

interface QuizBoxProps {
	userName: string;
	onCorrectAnswer?: () => void;
	onIncorrectAnswer?: () => void;
}

const QuizBox: React.FC<QuizBoxProps> = ({
	userName,
	onCorrectAnswer = () => {},
	onIncorrectAnswer = () => {},
}) => {
	// Sample question data (would come from API in a real app)
	const questionData = {
		question: "What is the capital of France?",
		options: ["London", "Berlin", "Paris", "Madrid"],
		correctAnswer: "Paris",
	};

	// Sample clues (would come from API in a real app)
	const clues = {
		leftClue: "This country is known for its famous tower.",
		rightClue: "This city hosts the Louvre Museum.",
	};

	const handleAnswerClick = (option: string) => {
		if (option === questionData.correctAnswer) {
			onCorrectAnswer();
		} else {
			onIncorrectAnswer();
		}
	};

	return (
		<div className="flex flex-row items-center justify-center gap-8 md:gap-12 w-full max-w-7xl mx-auto">
			{/* Left Clue */}
			<ClueBox
				clueText={clues.leftClue}
				className="hidden md:block flex-shrink-0"
			/>

			{/* Quiz Card */}
			<Card className="w-full max-w-md mx-auto bg-black/70 text-white border-none">
				<CardHeader>
					<div className="text-center mb-2">
						<h3 className="text-xl font-bold text-amber-400">
							Hello, {userName}!
						</h3>
					</div>
					<CardTitle className="text-lg font-bold text-center">
						{questionData.question}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex justify-center mb-4">
						<Button
							variant="outline"
							size="sm"
							className="bg-transparent text-white border-white hover:bg-white/20 hover:text-white"
						>
							<RefreshCw className="mr-2 h-4 w-4" />
							Refresh Question
						</Button>
					</div>
					<div className="flex flex-row justify-center gap-3">
						{questionData.options.map((option, index) => (
							<Button
								key={index}
								variant="outline"
								className="justify-center h-12 text-center bg-transparent text-white border-white hover:bg-white/20 hover:text-white"
								onClick={() => handleAnswerClick(option)}
							>
								{option}
							</Button>
						))}
					</div>

					{/* Mobile Clues (only shown on small screens) */}
					<div className="md:hidden space-y-3 mt-6">
						<ClueBox clueText={clues.leftClue} />
						<ClueBox clueText={clues.rightClue} />
					</div>
				</CardContent>
			</Card>

			{/* Right Clue */}
			<ClueBox
				clueText={clues.rightClue}
				className="hidden md:block flex-shrink-0"
			/>
		</div>
	);
};

export default QuizBox;
