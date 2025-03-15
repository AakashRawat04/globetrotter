export interface User {
	userid: string;
	username: string;
	email?: string;
	wins: number;
	loss: number;
}

export interface Question {
	id: string;
	question: string;
	clues?: string[];
	difficulty?: string;
}

export interface LoginCredentials {
	username: string;
	password: string;
}

export interface RegisterData extends LoginCredentials {
	email: string;
}

export interface ApiResponse<T> {
	message: string;
	data?: T;
	error?: string;
}
