import { createContext, useContext } from "react";
import type { AuthContextType } from "../types.ts";

export const AuthContext = createContext<AuthContextType>({
	user: null,
});

export const useAuth = () => useContext(AuthContext);
