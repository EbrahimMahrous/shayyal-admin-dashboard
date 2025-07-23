import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AuthContextType = {
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem("admin_token") !== null;
  });

  const login = () => {
    setIsAdmin(true);
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    localStorage.removeItem("admin_email");
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
