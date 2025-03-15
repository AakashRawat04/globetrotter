"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/useAuthStore";
import { LoginCredentials } from "@/types";
import { fetchApi } from "@/utils/api";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginFormProps {
	onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
	const [credentials, setCredentials] = useState<LoginCredentials>({
		username: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const login = useAuthStore((state) => state.login);
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCredentials((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const data = await fetchApi("/login", {
				method: "POST",
				body: credentials,
			});

			login(data.user, data.token);

			if (onSuccess) {
				onSuccess();
			} else {
				router.push("/");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className="space-y-2">
				<Label htmlFor="username">Username</Label>
				<Input
					id="username"
					name="username"
					placeholder="Enter your username"
					value={credentials.username}
					onChange={handleChange}
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="password">Password</Label>
				<Input
					id="password"
					name="password"
					type="password"
					placeholder="Enter your password"
					value={credentials.password}
					onChange={handleChange}
					required
				/>
			</div>

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading ? "Logging in..." : "Login"}
			</Button>
		</form>
	);
}
