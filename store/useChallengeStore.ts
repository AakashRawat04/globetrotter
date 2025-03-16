import { Challenge } from "@/types";
import { create } from "zustand";

interface ChallengeState {
	wins: number;
	loss: number;
	setWins: (wins: number) => void;
	setLoss: (loss: number) => void;
	// Current challenge code
	challengeCode: string | null;
	setChallengeCode: (code: string) => void;

	// Participants in the challenge
	participants: Challenge[];
	setParticipants: (participants: Challenge[]) => void;

	// Current user's record in the challenge
	userChallengeRecord: Challenge | null;
	setUserChallengeRecord: (record: Challenge) => void;
	updateUserChallengeStats: (wins: number, loss: number) => void;

	// Reset store state
	reset: () => void;
}

const initialState = {
	challengeCode: null,
	wins: 0,
	loss: 0,
	participants: [],
	userChallengeRecord: null,
};

const useChallengeStore = create<ChallengeState>((set) => ({
	...initialState,

	setChallengeCode: (code) => set({ challengeCode: code }),

	setWins: (wins) => set({ wins }),
	setLoss: (loss) => set({ loss }),

	setParticipants: (participants) => set({ participants }),

	setUserChallengeRecord: (record) => set({ userChallengeRecord: record }),

	updateUserChallengeStats: (wins, loss) =>
		set((state) => ({
			userChallengeRecord: {
				...state.userChallengeRecord!,
				wins,
				loss,
			},
		})),

	reset: () => set(initialState),
}));

export default useChallengeStore;
