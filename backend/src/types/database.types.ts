export interface User {
	userid: string;
	username: string;
	wins: number;
	loss: number;
	password: string;
}

export interface QuestionBank {
	qbid: string;
	city: string;
	country: string;
	clues: string[];
	fun_fact: string[];
	trivia: string[];
}

export interface Challenge {
	challengeid: string;
	userid: string;
	wins: number;
	loss: number;
}

export interface Database {
	users: User[];
	question_bank: QuestionBank[];
	challenges: Challenge[];
}
