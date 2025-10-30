import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "./api.ts";
import { AuthContext } from "./useAuth.ts";

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
	const profileQuery = useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			return api.auth.getProfile();
		},
		retry: false, // don't retry on 401
	});

	const userValue = profileQuery.isSuccess ? profileQuery.data : null;

	return <AuthContext.Provider value={{ user: userValue }}>{children}</AuthContext.Provider>;
};
