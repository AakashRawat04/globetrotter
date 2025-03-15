"use client";

import useAuthStore from "@/store/useAuthStore";
import { fetchApi } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAuthenticated, token, updateUser, logout } = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		// Redirect to auth page if not authenticated
		if (!isAuthenticated) {
			router.push("/auth");
			return;
		}

		// Verify token and get updated user info
		const verifyToken = async () => {
			try {
				const data = await fetchApi("/user/me", { token });
				updateUser(data.user);
			} catch (error) {
				console.error("Token validation failed:", error);
				// If token is invalid, log out the user
				logout();
				router.push("/auth");
			}
		};

		verifyToken();
	}, [isAuthenticated, token, updateUser, logout, router]);

	// Don't render anything while checking authentication
	if (!isAuthenticated) {
		return null;
	}

	return <>{children}</>;
}
