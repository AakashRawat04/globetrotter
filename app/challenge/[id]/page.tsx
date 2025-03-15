"use client";

import QuizBox from "@/components/QuizBox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useState } from "react";

interface Player {
	id: number;
	name: string;
	wins: number;
	losses: number;
}

export default function ChallengePage() {
	const [userName] = useState("Guest");
	const [wins, setWins] = useState(0);
	const [losses, setLosses] = useState(0);

	const params = useParams();

	// Sample leaderboard data (would come from API in a real app)
	const [leaderboard] = useState<Player[]>([
		{ id: 1, name: "JohnDoe", wins: 42, losses: 10 },
		{ id: 2, name: "JaneSmith", wins: 38, losses: 5 },
		{ id: 3, name: "BobJohnson", wins: 27, losses: 15 },
		{ id: 4, name: "AliceWilliams", wins: 25, losses: 8 },
		{ id: 5, name: "CharlieBrown", wins: 20, losses: 20 },
	]);

	const handleCorrectAnswer = () => {
		setWins((prev) => prev + 1);
	};

	const handleIncorrectAnswer = () => {
		setLosses((prev) => prev + 1);
	};

	return (
		<div className="min-h-screen flex flex-col bg-cover bg-opacity-50">
			{/* Header with website name and score */}
			<header className="w-full p-4 flex justify-between items-center bg-black/50 backdrop-blur-sm fixed top-0 z-30">
				<div className="text-amber-400 font-bold text-xl md:text-2xl">
					Globetrotter
				</div>
				<div className="flex space-x-4 text-white">
					<div className="bg-green-800/70 px-3 py-1 rounded-md flex items-center">
						<span className="font-semibold mr-1">Wins:</span> {wins}
					</div>
					<div className="bg-red-800/70 px-3 py-1 rounded-md flex items-center">
						<span className="font-semibold mr-1">Losses:</span> {losses}
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="flex-1 flex flex-col items-center justify-start p-4 md:px-12 pt-24">
				{/* Challenge Info */}
				<div className="w-full max-w-7xl mx-auto mb-6 text-center">
					<h1 className="text-2xl font-bold text-white">
						Challenge #{params.id}
					</h1>
					<p className="text-gray-300 mt-2">
						Complete the challenge to climb the leaderboard!
					</p>
				</div>

				{/* Quiz Box Component */}
				<QuizBox
					userName={userName}
					onCorrectAnswer={handleCorrectAnswer}
					onIncorrectAnswer={handleIncorrectAnswer}
				/>

				{/* Leaderboard */}
				<Card className="w-full max-w-2xl mx-auto mt-12 bg-black/70 text-white border-none">
					<CardHeader>
						<CardTitle className="text-xl text-center text-amber-400">
							Leaderboard
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-white/20">
										<th className="px-4 py-2 text-left">Rank</th>
										<th className="px-4 py-2 text-left">Player</th>
										<th className="px-4 py-2 text-center">Wins</th>
										<th className="px-4 py-2 text-center">Losses</th>
										<th className="px-4 py-2 text-center">Win Rate</th>
									</tr>
								</thead>
								<tbody>
									{leaderboard.map((player, index) => {
										const winRate =
											player.wins + player.losses > 0
												? Math.round(
														(player.wins / (player.wins + player.losses)) * 100
												  )
												: 0;

										return (
											<tr
												key={player.id}
												className="border-b border-white/10 hover:bg-white/5"
											>
												<td className="px-4 py-3">{index + 1}</td>
												<td className="px-4 py-3 font-medium">{player.name}</td>
												<td className="px-4 py-3 text-center text-green-400">
													{player.wins}
												</td>
												<td className="px-4 py-3 text-center text-red-400">
													{player.losses}
												</td>
												<td className="px-4 py-3 text-center">{winRate}%</td>
											</tr>
										);
									})}
									{/* Current player row */}
									<tr className="bg-amber-800/20">
										<td className="px-4 py-3">-</td>
										<td className="px-4 py-3 font-medium">{userName} (You)</td>
										<td className="px-4 py-3 text-center text-green-400">
											{wins}
										</td>
										<td className="px-4 py-3 text-center text-red-400">
											{losses}
										</td>
										<td className="px-4 py-3 text-center">
											{wins + losses > 0
												? Math.round((wins / (wins + losses)) * 100)
												: 0}
											%
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
