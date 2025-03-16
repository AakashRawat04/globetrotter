import { Challenge, Question, User } from "@/types";
import fetchApi from "@/utils/api";

export const fetchRandomQuestion = async (
	token: string
): Promise<Question | undefined> => {
	try {
		console.log("Fetching random question...");
		const data = await fetchApi("/guess", {
			headers: {
				"Access-Control-Allow-Origin": "*",
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
	token: string,
	challengeCode?: string
): Promise<
	{ correct: boolean; data: { wins: number; loss: number } } | undefined
> => {
	try {
		const data = await fetchApi("/validate", {
			method: "POST",
			body: { qbid, answer, challengeCode },
			headers: {
				"Access-Control-Allow-Origin": "*",

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
				"Access-Control-Allow-Origin": "*",

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
				"Access-Control-Allow-Origin": "*",

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
	token: string,
	challengeId?: string
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
			body: { qbid, challengeId },
			headers: {
				"Access-Control-Allow-Origin": "*",

				Authorization: `Bearer ${token}`,
			},
		});
		return data;
	} catch (error) {
		console.error("Error getting correct answer:", error);
	}
};

export const createChallenge = async (
	token: string
): Promise<
	| {
			challenge: {
				challengeid: string;
				challenge_code: string;
				userid: string;
				wins: number;
				loss: number;
			};
	  }
	| undefined
> => {
	try {
		const data = await fetchApi("/challenge/create", {
			method: "POST",
			headers: {
				"Access-Control-Allow-Origin": "*",

				Authorization: `Bearer ${token}`,
			},
		});
		console.log("Data from createChallenge:", data);
		return data;
	} catch (error) {
		console.error("Error creating challenge:", error);
	}
};

export const getChallengeByCode = async (
	challengeCode: string,
	token: string
): Promise<{ participants: Challenge[] } | undefined> => {
	try {
		const headers: Record<string, string> = {};
		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}

		const data = await fetchApi(`/challenge/${challengeCode}`, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				...headers,
			},
		});

		console.log("Data from getChallengeByCode:", data);
		return data;
	} catch (error) {
		console.error("Error fetching challenge:", error);
	}
};

export const validateAnswerInChallenge = async (
	qbid: string,
	answer: string,
	token: string,
	challengeId: string
): Promise<
	{ correct: boolean; data: { wins: number; loss: number } } | undefined
> => {
	try {
		const data = await fetchApi("/validate", {
			method: "POST",
			body: { qbid, answer, challengeId },
			headers: {
				"Access-Control-Allow-Origin": "*",

				Authorization: `Bearer ${token}`,
			},
		});
		console.log("Data from validateAnswerInChallenge:", data);
		return data;
	} catch (error) {
		console.error("Error validating answer in challenge:", error);
	}
};
