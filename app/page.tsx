"use client";

import QuizBox from "@/components/QuizBox";
import ShareChallengeDialog from "@/components/ShareChallengeDialog";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";
import { useState } from "react";

export default function Home() {
	const [name, setName] = useState("");
	const [showModal, setShowModal] = useState(true);
	const [inputName, setInputName] = useState("");
	const [wins, setWins] = useState(0);
	const [losses, setLosses] = useState(0);
	const [showShareDialog, setShowShareDialog] = useState(false);

	const handleStartQuiz = () => {
		if (inputName.trim()) {
			setName(inputName);
			setShowModal(false);
		}
	};

	const handleCorrectAnswer = () => {
		setWins((prev) => prev + 1);
	};

	const handleIncorrectAnswer = () => {
		setLosses((prev) => prev + 1);
	};

	const handleChallengeClick = () => {
		setShowShareDialog(true);
	};

	// Calculate if name input is valid (not empty after trimming)
	const isNameValid = inputName.trim().length > 0;

	return (
		<div className="min-h-screen flex flex-col bg-cover bg-opacity-50">
			{/* Share Challenge Dialog */}
			<ShareChallengeDialog
				isOpen={showShareDialog}
				onClose={() => setShowShareDialog(false)}
				playerName={name || inputName}
			/>

			{/* Header with website name, challenge button, and score */}
			{!showModal && (
				<header className="w-full p-4 flex justify-between items-center bg-black/50 backdrop-blur-sm fixed top-0 z-30">
					<div className="text-amber-400 font-bold text-xl md:text-2xl">
						Globetrotter
					</div>

					<div className="flex items-center gap-4">
						{/* Challenge Button */}
						<Button
							onClick={handleChallengeClick}
							size="sm"
							variant="outline"
							className="bg-amber-500/90 text-black hover:bg-amber-600 border-none"
						>
							<Users className="mr-2 h-4 w-4" />
							Challenge
						</Button>

						{/* Score Display */}
						<div className="flex space-x-3 text-white">
							<div className="bg-green-800/70 px-3 py-1 rounded-md flex items-center">
								<span className="font-semibold mr-1">Wins:</span> {wins}
							</div>
							<div className="bg-red-800/70 px-3 py-1 rounded-md flex items-center">
								<span className="font-semibold mr-1">Losses:</span> {losses}
							</div>
						</div>
					</div>
				</header>
			)}

			{/* Main Content */}
			<div className="flex-1 flex items-center justify-center p-4 md:px-12 pt-20">
				{/* Name Modal */}
				<Dialog open={showModal} onOpenChange={setShowModal}>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle className="text-xl">
								Welcome to Globetrotter!
							</DialogTitle>
							<DialogDescription>
								Please enter your name to start the quiz
							</DialogDescription>
						</DialogHeader>
						<div className="flex items-center space-x-2 py-4">
							<Input
								placeholder="Enter your name"
								value={inputName}
								onChange={(e) => setInputName(e.target.value)}
								className="flex-1"
							/>
						</div>
						<DialogFooter className="flex flex-col sm:flex-row gap-2">
							<Button onClick={handleStartQuiz} disabled={!isNameValid}>
								Play Solo
							</Button>
							<Button
								onClick={handleChallengeClick}
								variant="outline"
								className="bg-amber-500 text-black hover:bg-amber-600 hover:text-black"
								disabled={!isNameValid}
							>
								Challenge a Friend
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Quiz Interface with Clues */}
				{!showModal && (
					<QuizBox
						userName={name}
						onCorrectAnswer={handleCorrectAnswer}
						onIncorrectAnswer={handleIncorrectAnswer}
					/>
				)}
			</div>
		</div>
	);
}
