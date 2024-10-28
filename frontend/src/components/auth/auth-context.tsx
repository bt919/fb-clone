import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export type AuthUser = {
  token: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other";
};

type AuthContext = {
  authData: AuthUser | null;
  login: (data: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContext | null>(null);

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (authContext === null) {
    throw new Error("useAuth has to be used within <AuthProvider.Provider>");
  }

  return authContext;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authData, setAuthData] = useState<AuthUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuthData = localStorage.getItem("authData");
    if (storedAuthData) {
      const data = JSON.parse(storedAuthData);
      setAuthData(data);
    }
  }, []);

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem("authData");
    navigate({ to: "/", state: { message: "Successfully logged out." } });
  };

  const login = (data: AuthUser) => {
    setAuthData(data);
    localStorage.setItem("authData", JSON.stringify(data));
    navigate({ to: "/home" });
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}