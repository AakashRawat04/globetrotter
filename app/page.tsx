"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import QuizBox from "@/components/QuizBox";
import ShareChallengeDialog from "@/components/ShareChallengeDialog";
import { Button } from "@/components/ui/button";
import { fetchRandomQuestion, getUserProfile } from "@/services/api.service";
import useAuthStore from "@/store/useAuthStore";
import useGameStore from "@/store/useGameStore";
import { Question } from "@/types";
import { LogOut, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
	const { user, token, logout } = useAuthStore();
	const [showShareDialog, setShowShareDialog] = useState(false);
	const [question, setQuestion] = useState<Question | null>(null);
	const [error, setError] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	const handleChallengeClick = () => {
		setShowShareDialog(true);
	};

	const { wins, loss, setLoss, setWins } = useGameStore();

	const handleLogout = () => {
		logout();
		router.push("/auth");
	};

	useEffect(() => {
		const fetchUserDetails = async () => {
			if (!token) {
				console.error("No token found");
				return;
			}
			const userDetails = await getUserProfile(token);
			if (userDetails) {
				setWins(userDetails.user.wins);
				setLoss(userDetails.user.loss);
			} else {
				console.error("Error fetching user details");
			}
		};
		fetchUserDetails();
	}, [token, setWins, setLoss]);
	useEffect(() => {
		const randomQuestion = async () => {
			const question = await fetchRandomQuestion(token!);
			if (!question) {
				console.error("Error fetching question:");
				setError(true);
				setIsLoading(false);
				return;
			}
			setQuestion(question);
			setIsLoading(false);
		};
		randomQuestion();
	}, [token]);

	return (
		<ProtectedRoute>
			{user && question && !isLoading ? (
				<div className="min-h-screen flex flex-col bg-cover bg-opacity-50">
					{/* Share Challenge Dialog */}
					<ShareChallengeDialog
						isOpen={showShareDialog}
						onClose={() => setShowShareDialog(false)}
						playerName={user.username || ""}
					/>

					{/* Header with website name, challenge button, and score */}
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
									<span className="font-semibold mr-1">Losses:</span> {loss}
								</div>
							</div>

							{/* Logout Button */}
							<Button
								onClick={handleLogout}
								size="sm"
								variant="ghost"
								className="text-white hover:bg-red-600/20"
							>
								<LogOut className="mr-2 h-4 w-4" />
								Logout
							</Button>
						</div>
					</header>

					{/* Main Content */}
					<div className="flex-1 flex items-center justify-center p-4 md:px-12 pt-20">
						{/* Quiz Interface with Clues */}
						{error ? (
							<div className="text-red-500 text-center">
								Something went wrong while fetching the question. Error: {error}
							</div>
						) : (
							/* Quiz Box */
							<QuizBox
								userName={user.username}
								clues={question.clues}
								qbid={question.qbid}
								trivia={question.trivia}
								key={question.qbid}
							/>
						)}
					</div>
				</div>
			) : (
				<div className="min-h-screen flex items-center justify-center">
					<div className="animate-pulse">Loading...</div>
				</div>
			)}
		</ProtectedRoute>
	);
}
