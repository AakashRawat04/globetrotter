const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface ApiOptions {
	method?: string;
	headers?: Record<string, string>;
	body?: object;
}

export async function fetchApi(endpoint: string, options: ApiOptions = {}) {
	const { method = "GET", headers = {}, body } = options;

	const requestHeaders: Record<string, string> = {
		"Content-Type": "application/json",
		...headers,
	};

	const config: RequestInit = {
		method,
		headers: requestHeaders,
	};

	if (body) {
		config.body = JSON.stringify(body);
	}

	try {
		const response = await fetch(`${API_URL}/api${endpoint}`, config);
		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || "API request failed");
		}

		return data;
	} catch (error) {
		console.error("API Error:", error);
		throw error;
	}
}

export default fetchApi;
