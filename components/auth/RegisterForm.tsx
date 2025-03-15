"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/useAuthStore";
import { RegisterData } from "@/types";
import { fetchApi } from "@/utils/api";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RegisterFormProps {
	onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
	const [formData, setFormData] = useState<RegisterData>({
		username: "",
		email: "",
		password: "",
	});
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const login = useAuthStore((state) => state.login);
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		// Validate form
		if (formData.password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setIsLoading(true);

		try {
			const data = await fetchApi("/register", {
				method: "POST",
				body: formData,
			});

			login(data.user, data.token);

			if (onSuccess) {
				onSuccess();
			} else {
				router.push("/");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Registration failed");
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
					placeholder="Choose a username"
					value={formData.username}
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
					placeholder="Create a password"
					value={formData.password}
					onChange={handleChange}
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="confirmPassword">Confirm Password</Label>
				<Input
					id="confirmPassword"
					type="password"
					placeholder="Confirm your password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
				/>
			</div>

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading ? "Creating account..." : "Register"}
			</Button>
		</form>
	);
}
