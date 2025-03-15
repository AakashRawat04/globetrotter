"use client";

import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface ProtectedRouteProps {
	children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const user = useAuthStore((state) => state.user);
	const router = useRouter();
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		// Check auth status
		const checkAuth = () => {
			if (!user) {
				router.push("/auth");
			} else {
				setIsChecking(false);
			}
		};

		checkAuth();
		// Small timeout to ensure store is hydrated
		const timer = setTimeout(() => {
			if (!user) {
				router.push("/auth");
			}
			setIsChecking(false);
		}, 500);

		return () => clearTimeout(timer);
	}, [user, router]);

	if (isChecking) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-pulse text-amber-500">Authenticating...</div>
			</div>
		);
	}

	if (!user) {
		return null; // Will redirect in useEffect
	}

	return <>{children}</>;
};

export default ProtectedRoute;
