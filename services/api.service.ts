import { Question, User } from "@/types";
import fetchApi from "@/utils/api";

export const fetchRandomQuestion = async (
	token: string
): Promise<Question | undefined> => {
	try {
		console.log("Fetching random question...");
		const data = await fetchApi("/guess", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return data;
	} catch (error) {
		console.error("Error fetching question:", error);
	}
};

export const validateAnswer = async (
	qbid: string,
	answer: string,
	token: string
): Promise<
	{ correct: boolean; data: { wins: number; loss: number } } | undefined
> => {
	try {
		const data = await fetchApi("/validate", {
			method: "POST",
			body: { qbid, answer },
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		console.log("Data from validateAnswer:", data);
		return data;
	} catch (error) {
		console.error("Error validating answer:", error);
	}
};

export const updateUserStats = async (
	wins: number,
	losses: number,
	token: string
): Promise<{ wins: number; loss: number } | undefined> => {
	try {
		const data = await fetchApi("/user/stats", {
			method: "PUT",
			body: { wins, losses },
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return data;
	} catch (error) {
		console.error("Error updating stats:", error);
	}
};

export const getUserProfile = async (
	token: string
): Promise<{ user: User } | undefined> => {
	try {
		const data = await fetchApi("/user/me", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return data;
	} catch (error) {
		console.error("Error fetching user profile:", error);
	}
};

export const getCorrectAnswer = async (
	qbid: string,
	token: string
): Promise<
	| {
			answer: string;
			data: { wins: number; loss: number; correctAnswer: string };
	  }
	| undefined
> => {
	try {
		const data = await fetchApi("/giveup", {
			method: "POST",
			body: { qbid },
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return data;
	} catch (error) {
		console.error("Error getting correct answer:", error);
	}
};
