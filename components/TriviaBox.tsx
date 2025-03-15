import Image from "next/image";
import React from "react";

interface TriviaBoxProps {
	clueText: string;
	className?: string;
}

const TriviaBox: React.FC<TriviaBoxProps> = ({ clueText, className = "" }) => {
	return (
		<div
			className={`text-black p-8 relative flex flex-col items-center justify-center min-h-[250px] ${className}`}
			style={{
				backgroundImage: "url('/images/scroll.png')",
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				width: "200px",
			}}
		>
			<div className="relative z-10 text-center max-w-[200px] p-4">
				<h4 className="text-amber-800 font-bold mb-4 text-center text-xl">
					Clue
				</h4>
				<p className="text-base font-medium">{clueText}</p>
			</div>

			{/* Thinking meme image positioned at bottom right */}
			<div className="absolute bottom-0 right-0 z-20">
				<Image
					src="/images/dankmemerthinking.png"
					alt="Thinking meme"
					width={80}
					height={80}
					className="object-contain"
				/>
			</div>
		</div>
	);
};

export default TriviaBox;
