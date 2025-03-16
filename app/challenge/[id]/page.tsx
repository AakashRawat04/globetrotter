"use client";

import ChallengeQuizBox from "@/components/ChallengeQuizBox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	fetchRandomQuestion,
	getChallengeByCode,
} from "@/services/api.service";
import useAuthStore from "@/store/useAuthStore";
import useChallengeStore from "@/store/useChallengeStore";
import { Challenge, Question } from "@/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChallengePage() {
	const params = useParams();
	const challengeCode = params.id as string;
	const { token, user } = useAuthStore();
	const { wins, loss, setWins, setLoss } = useChallengeStore();
	const [question, setQuestion] = useState<Question | null>(null);
	const [, setError] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(true);
	const [participants, setParticipants] = useState<Challenge[]>([]);

	useEffect(() => {
		const randomQuestion = async () => {
			console.log("token", token);
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

		// getChallengeByCode
		const getLeaderboardRecords = async () => {
			if (!token) {
				console.error("No token found");
				return;
			}
			const leaderboardRecords = await getChallengeByCode(
				challengeCode,
				token!
			);
			if (leaderboardRecords) {
				setParticipants(leaderboardRecords.participants);

				// Find current user in participants and update wins/losses in store
				if (user && leaderboardRecords.participants.length > 0) {
					const currentUserRecord = leaderboardRecords.participants.find(
						(participant) => participant.userid === user.userid
					);

					if (currentUserRecord) {
						setWins(currentUserRecord.wins);
						setLoss(currentUserRecord.loss);
					}
				}
			} else {
				console.error("Error fetching user details");
			}
		};
		getLeaderboardRecords();
	}, [token, challengeCode, user, setLoss, setWins]);

	return (
		<div className="min-h-screen flex flex-col bg-cover bg-opacity-50">
			{/* Header with website name and score */}
			<header className="w-full p-4 flex justify-between items-center bg-black/50 backdrop-blur-sm fixed top-0 z-30">
				<Link href="/" className="text-amber-400 font-bold text-xl md:text-2xl">
					Globetrotter
				</Link>
				<div className="flex space-x-4 text-white">
					<div className="bg-green-800/70 px-3 py-1 rounded-md flex items-center">
						<span className="font-semibold mr-1">Wins:</span> {wins || 0}
					</div>
					<div className="bg-red-800/70 px-3 py-1 rounded-md flex items-center">
						<span className="font-semibold mr-1">Losses:</span> {loss || 0}
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="flex-1 flex flex-col items-center justify-start p-4 md:px-12 pt-24">
				{/* Quiz Box Component - only show when logged in */}
				{isLoading ? (
					<p className="text-white">Loading...</p>
				) : (
					<>
						{token && question ? (
							<ChallengeQuizBox
								userName={user?.username || "Guest"}
								clues={question.clues}
								trivia={question.trivia}
								qbid={question.qbid}
								challengeCode={challengeCode}
							/>
						) : (
							<Card className="w-full max-w-xl mx-auto bg-black/70 text-white border-none p-6">
								<CardContent className="text-center">
									<p className="mb-4">
										Please log in to participate in this challenge.
									</p>
									<Link href="/auth" className="text-amber-400 hover:underline">
										Login here
									</Link>
								</CardContent>
							</Card>
						)}
					</>
				)}

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
									{participants.length === 0 ? (
										<tr>
											<td colSpan={5} className="px-4 py-3 text-center">
												No participants yet. Be the first to join!
											</td>
										</tr>
									) : (
										participants.map((player, index) => {
											const winRate =
												player.wins + player.loss > 0
													? Math.round(
															(player.wins / (player.wins + player.loss)) * 100
													  )
													: 0;

											const isCurrentUser = user?.userid === player.userid;

											return (
												<tr
													key={player.userid}
													className={`border-b border-white/10 hover:bg-white/5 ${
														isCurrentUser ? "bg-amber-800/20" : ""
													}`}
												>
													<td className="px-4 py-3">{index + 1}</td>
													<td className="px-4 py-3 font-medium">
														{isCurrentUser
															? `${player.userid} (You)`
															: player.userid}
													</td>
													<td className="px-4 py-3 text-center text-green-400">
														{player.wins}
													</td>
													<td className="px-4 py-3 text-center text-red-400">
														{player.loss}
													</td>
													<td className="px-4 py-3 text-center">{winRate}%</td>
												</tr>
											);
										})
									)}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
