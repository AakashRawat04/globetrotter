import { User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	login: (userData: User, token: string) => void;
	logout: () => void;
	updateUser: (userData: Partial<User>) => void;
}

const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			token: null,
			isAuthenticated: false,

			login: (userData: User, token: string) =>
				set({
					user: userData,
					token: token,
					isAuthenticated: true,
				}),

			logout: () =>
				set({
					user: null,
					token: null,
					isAuthenticated: false,
				}),

			updateUser: (userData: Partial<User>) =>
				set((state) => ({
					user: state.user ? { ...state.user, ...userData } : null,
				})),
		}),
		{
			name: "auth-storage",
		}
	)
);

export default useAuthStore;
