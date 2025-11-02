import { useAuth } from "../utils/useAuth.ts";
import { useLocation } from "wouter";
import { type PropsWithChildren, useEffect } from "react";

function ProtectedRoute(props: PropsWithChildren) {
	const auth = useAuth();
	const [, navigate] = useLocation();

	useEffect(() => {
		if (auth.user == null && localStorage.getItem("access_token") == null) {
			navigate("/login");
		}
	}, [auth.user, navigate]);

	return props.children;
}

export default ProtectedRoute;
