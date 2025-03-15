"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import QuizBox from "@/components/QuizBox";
import ShareChallengeDialog from "@/components/ShareChallengeDialog";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/useAuthStore";
import { LogOut, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);
	const [wins, setWins] = useState(user?.wins || 0);
	const [losses, setLosses] = useState(user?.loss || 0);
	const [showShareDialog, setShowShareDialog] = useState(false);
	const router = useRouter();

	const handleCorrectAnswer = () => {
		setWins((prev) => prev + 1);
	};

	const handleIncorrectAnswer = () => {
		setLosses((prev) => prev + 1);
	};

	const handleChallengeClick = () => {
		setShowShareDialog(true);
	};

	const handleLogout = () => {
		logout();
		router.push("/auth");
	};

	return (
		<ProtectedRoute>
			<div className="min-h-screen flex flex-col bg-cover bg-opacity-50">
				{/* Share Challenge Dialog */}
				<ShareChallengeDialog
					isOpen={showShareDialog}
					onClose={() => setShowShareDialog(false)}
					playerName={user?.username || ""}
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
								<span className="font-semibold mr-1">Losses:</span> {losses}
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
					<QuizBox
						userName={user?.username || ""}
						onCorrectAnswer={handleCorrectAnswer}
						onIncorrectAnswer={handleIncorrectAnswer}
					/>
				</div>
			</div>
		</ProtectedRoute>
	);
}
