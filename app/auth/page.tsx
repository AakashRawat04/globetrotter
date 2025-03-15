"use client";

import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthPage() {
	const [activeTab, setActiveTab] = useState("login");
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const router = useRouter();

	useEffect(() => {
		// Redirect to home if already logged in
		if (isAuthenticated) {
			router.push("/");
		}
	}, [isAuthenticated, router]);

	// Handle tab change
	const handleTabChange = (value: string) => {
		setActiveTab(value);
	};

	// Handle successful auth
	const handleAuthSuccess = () => {
		router.push("/");
	};

	if (isAuthenticated) {
		return null; // Don't render anything while redirecting
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl text-center">Globetrotter</CardTitle>
					<CardDescription className="text-center">
						Test your geography knowledge and challenge friends
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs
						value={activeTab}
						onValueChange={handleTabChange}
						className="w-full"
					>
						<TabsList className="grid w-full grid-cols-2 mb-4">
							<TabsTrigger value="login">Login</TabsTrigger>
							<TabsTrigger value="register">Register</TabsTrigger>
						</TabsList>

						<TabsContent value="login">
							<LoginForm onSuccess={handleAuthSuccess} />
						</TabsContent>

						<TabsContent value="register">
							<RegisterForm onSuccess={handleAuthSuccess} />
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
