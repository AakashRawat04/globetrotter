import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
	wins: number;
	loss: number;
	setWins: (wins: number) => void;
	setLoss: (loss: number) => void;
}

const useGameStore = create<GameState>()(
	persist(
		(set) => ({
			wins: 0,
			loss: 0,
			user: null,

			setWins: (wins: number) => set({ wins }),
			setLoss: (loss: number) => set({ loss }),
		}),
		{
			name: "game-storage",
		}
	)
);

export default useGameStore;
