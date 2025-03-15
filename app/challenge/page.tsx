"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Copy, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ChallengePage() {
	const [challengeCode] = useState(
		"GEO-" + Math.random().toString(36).substring(2, 8).toUpperCase()
	);
	const [copied, setCopied] = useState(false);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(challengeCode);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const shareChallenge = () => {
		const shareText = `Challenge me on Globetrotter! My challenge code is: ${challengeCode}`;

		if (navigator.share) {
			navigator.share({
				title: "Globetrotter Challenge",
				text: shareText,
				url: window.location.href,
			});
		} else {
			copyToClipboard();
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Back Button */}
				<div className="mb-6">
					<Link href="/">
						<Button
							variant="outline"
							size="sm"
							className="text-white bg-transparent"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Home
						</Button>
					</Link>
				</div>

				{/* Challenge Card */}
				<Card className="w-full bg-black/70 text-white border-none">
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-center text-amber-400">
							Challenge a Friend
						</CardTitle>
						<CardDescription className="text-center text-white/80">
							Share your challenge code with a friend to start a match
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="challenge-code" className="text-white">
								Your challenge code
							</Label>
							<div className="flex items-center space-x-2">
								<Input
									id="challenge-code"
									value={challengeCode}
									readOnly
									className="bg-white/10 text-center font-mono text-lg"
								/>
								<Button
									variant="outline"
									size="icon"
									onClick={copyToClipboard}
									className="shrink-0 bg-white/10 hover:bg-white/20"
								>
									<Copy className="h-4 w-4" />
								</Button>
							</div>
							{copied && (
								<p className="text-green-400 text-sm text-center">
									Copied to clipboard!
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="friend-code" className="text-white">
								Or enter friends code
							</Label>
							<Input
								id="friend-code"
								className="bg-white/10"
								placeholder="Enter code (e.g., GEO-AB12CD)"
							/>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col gap-3">
						<Button
							className="w-full bg-amber-500 text-black hover:bg-amber-600"
							onClick={shareChallenge}
						>
							<Share2 className="mr-2 h-4 w-4" />
							Share Challenge
						</Button>
						<Button className="w-full">Join Challenge</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
