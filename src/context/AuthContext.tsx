import { createContext, useContext } from "react";

type AuthContextType = { isAdmin: boolean };
export const AuthContext = createContext<AuthContextType>({ isAdmin: false });

export const useAuth = () => useContext(AuthContext);
