"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { createChallenge } from "@/services/api.service";
import useAuthStore from "@/store/useAuthStore";
import { Copy, Smartphone, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ShareChallengeDialogProps {
	isOpen: boolean;
	onClose: () => void;
	playerName: string;
}

const ShareChallengeDialog: React.FC<ShareChallengeDialogProps> = ({
	isOpen,
	onClose,
	playerName,
}) => {
	const [challengeCode, setChallengeCode] = useState("");
	const [copied, setCopied] = useState(false);
	const [cityImage, setCityImage] = useState<string | null>(null);
	const [imageLoading, setImageLoading] = useState(false);
	const [imageError, setImageError] = useState(false);
	const router = useRouter();
	const { token } = useAuthStore();

	// Generate a unique challenge code and fetch image when the dialog opens
	useEffect(() => {
		if (isOpen) {
			const initializeChallenge = async () => {
				if (!token) {
					console.error("No token found");
					return;
				}
				// Generate a unique challenge with code
				const response = await createChallenge(token);
				console.log("Response from createChallenge:", response);
				if (!response) {
					console.error("Error creating challenge:", response);
					return;
				}
				setChallengeCode(response.challenge.challenge_code);
			};
			initializeChallenge();
			fetchRandomCityImage();
		}
	}, [isOpen, token]);

	// Fetch random city image
	const fetchRandomCityImage = async () => {
		setImageLoading(true);
		setImageError(false);
		try {
			const response = await fetch(
				"https://api.api-ninjas.com/v1/randomimage?category=city&width=300&height=200",
				{
					headers: {
						"X-Api-Key": "PakWfZ+ornnPC6klIeUuaQ==Vj9VtKmqkQVb7tSW",
						Accept: "image/jpg",
					},
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			// Get the blob data
			const imageBlob = await response.blob();
			// Convert to base64 for display
			const reader = new FileReader();
			reader.onloadend = () => {
				setCityImage(reader.result as string);
				setImageLoading(false);
			};
			reader.readAsDataURL(imageBlob);
		} catch (error) {
			console.error("Error fetching city image:", error);
			setImageError(true);
			setImageLoading(false);
		}
	};

	// Create the share URL and message
	const pathname = usePathname();
	const fullUrl =
		typeof window !== "undefined" ? `${window.location.origin}${pathname}` : "";
	const shareUrl = `${fullUrl}/challenge/${challengeCode}`;
	const shareMessage = `${playerName} has challenged you to a geography quiz on Globetrotter! Join the challenge: ${shareUrl}`;

	// Copy link to clipboard
	const copyToClipboard = () => {
		navigator.clipboard.writeText(shareUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	// Share via WhatsApp
	const shareViaWhatsApp = () => {
		const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
			shareMessage
		)}`;
		window.open(whatsappUrl, "_blank");
	};

	// Navigate to challenge
	const goToChallenge = () => {
		onClose(); // Close the dialog
		router.push(shareUrl); // Navigate to the challenge URL
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-md bg-black/90 text-white border-amber-500/50">
				<DialogHeader>
					<DialogTitle className="text-xl text-amber-400">
						Challenge a Friend
					</DialogTitle>
					<DialogDescription className="text-white/80">
						Share this challenge with a friend to see who knows geography
						better!
					</DialogDescription>
				</DialogHeader>

				{/* Challenge Preview */}
				<div className="bg-gradient-to-br from-blue-900 to-indigo-950 p-4 rounded-md my-2 relative">
					<div className="text-center mb-3">
						<p className="text-sm text-white/80">
							Test your geography knowledge in a global showdown
						</p>
					</div>

					{/* City Image Display */}
					<div className="flex justify-center overflow-hidden rounded-md h-[200px] relative">
						{imageLoading && (
							<div className="w-full h-full bg-white/10 flex items-center justify-center">
								<div className="animate-pulse text-white/50">
									Loading city image...
								</div>
							</div>
						)}

						{imageError && (
							<div className="w-full h-full bg-white/10 flex items-center justify-center">
								<span className="text-6xl">🌍</span>
							</div>
						)}

						{cityImage && !imageLoading && !imageError && (
							<div className="w-full h-full relative">
								<Image
									src={cityImage}
									alt="Random city"
									fill
									className="object-cover"
									priority
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
								<div className="absolute bottom-2 left-2 text-xs text-white/80">
									Can you identify cities around the world?
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Share Options */}
				<div className="space-y-3">
					<Button
						className="w-full bg-green-600 hover:bg-green-700 text-white"
						onClick={shareViaWhatsApp}
					>
						<Smartphone className="mr-2 h-4 w-4" />
						Share via WhatsApp
					</Button>

					<Button
						className="w-full bg-amber-500 text-black hover:bg-amber-600"
						onClick={goToChallenge}
					>
						Go to Challenge
					</Button>

					<div className="flex gap-2">
						<Button
							variant="outline"
							className="flex-1 bg-white/10 text-white hover:bg-white/20"
							onClick={copyToClipboard}
						>
							<Copy className="mr-2 h-4 w-4" />
							{copied ? "Copied!" : "Copy Link"}
						</Button>

						<Button
							variant="outline"
							className="bg-white/10 text-white hover:bg-white/20"
							onClick={onClose}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ShareChallengeDialog;
