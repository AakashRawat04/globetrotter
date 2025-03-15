import Image from "next/image";
import React from "react";

interface ClueBoxProps {
	clueText: string;
	className?: string;
}

const ClueBox: React.FC<ClueBoxProps> = ({ clueText, className = "" }) => {
	return (
		<div
			className={`text-black p-6 relative flex flex-col items-center justify-center min-h-[200px] ${className}`}
			style={{
				backgroundImage: "url('/images/scroll.png')",
				backgroundSize: "contain",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
		>
			<div className="relative z-10 text-center max-w-[150px] p-3">
				<h4 className="text-amber-800 font-bold mb-3 text-center text-lg">
					Clue
				</h4>
				<p className="text-sm font-medium">{clueText}</p>
			</div>

			{/* Thinking meme image positioned at bottom right */}
			<div className="absolute bottom-0 right-0 z-20">
				<Image
					src="/images/dankmemerthinking.png"
					alt="Thinking meme"
					width={60}
					height={60}
					className="object-contain"
				/>
			</div>
		</div>
	);
};

export default ClueBox;
