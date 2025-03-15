export interface User {
	userid: string;
	username: string;
	wins: number;
	loss: number;
}

export interface Question {
	qbid: string;
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

export interface LoginCredentials {
	username: string;
	password: string;
}

export interface RegisterData extends LoginCredentials {
	email: string;
}
