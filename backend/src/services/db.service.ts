import { supabase } from "../config/supabase";
import { Challenge, QuestionBank, User } from "../types/database.types";

export const userService = {
	async createUser(user: Omit<User, "userid">): Promise<User | null> {
		const { data, error } = await supabase
			.from("users")
			.insert([user])
			.select()
			.single();

		if (error) {
			console.error("Error creating user:", error);
			return null;
		}

		return data as User;
	},

	async getUserByUsername(username: string): Promise<User | null> {
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("username", username)
			.single();

		if (error) {
			console.error("Error fetching user:", error);
			return null;
		}

		return data as User;
	},

	async getUserById(userid: string): Promise<User | null> {
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("userid", userid)
			.single();

		if (error) {
			console.error("Error fetching user:", error);
			return null;
		}

		return data as User;
	},

	async updateUserStats(
		userid: string,
		wins: number,
		loss: number
	): Promise<User | null> {
		const { data, error } = await supabase
			.from("users")
			.update({ wins, loss })
			.eq("userid", userid)
			.select("userid, username, wins, loss")
			.single();

		if (error) {
			console.error("Error updating user stats:", error);
			return null;
		}

		return data as User;
	},
};

export const questionService = {
	async getRandomQuestion(): Promise<QuestionBank | null> {
		// First, get the count of questions in the database
		const { count, error: countError } = await supabase
			.from("question_bank")
			.select("*", { count: "exact", head: true });

		if (countError || !count) {
			console.error("Error fetching question count:", countError);
			return null;
		}

		// Generate a random index between 0 and count-1
		const randomIndex = Math.floor(Math.random() * count);

		// Fetch the question at the random index
		const { data, error } = await supabase
			.from("question_bank")
			.select("*")
			.range(randomIndex, randomIndex);

		if (error || !data.length) {
			console.error("Error fetching random question:", error);
			return null;
		}

		return data[0] as QuestionBank;
	},

	async validateAnswer(qbid: string, answer: string): Promise<boolean> {
		// Get the question from the database
		const { data, error } = await supabase
			.from("question_bank")
			.select("*")
			.eq("qbid", qbid)
			.single();

		if (error) {
			console.error("Error validating answer:", error);
			return false;
		}

		const question = data as QuestionBank;
		const normalizedAnswer = answer.trim().toLowerCase();
		const correctCity = question.city.toLowerCase();

		return normalizedAnswer === correctCity;
	},

	async getQuestionById(qbid: string): Promise<QuestionBank | null> {
		const { data, error } = await supabase
			.from("question_bank")
			.select("*")
			.eq("qbid", qbid)
			.single();

		if (error) {
			console.error("Error fetching question by ID:", error);
			return null;
		}

		return data as QuestionBank;
	},
};

export const challengeService = {
	async createChallenge(userid: string): Promise<Challenge | null> {
		const challenge = {
			userid,
			wins: 0,
			loss: 0,
		};

		const { data, error } = await supabase
			.from("challenge")
			.insert([challenge])
			.select()
			.single();

		if (error) {
			console.error("Error creating challenge:", error);
			return null;
		}

		return data as Challenge;
	},

	async getChallengeById(challengeid: string): Promise<Challenge[] | null> {
		const { data, error } = await supabase
			.from("challenge")
			.select("*")
			.eq("challengeid", challengeid);

		if (error) {
			console.error("Error fetching challenge:", error);
			return null;
		}

		return data as Challenge[];
	},
};
