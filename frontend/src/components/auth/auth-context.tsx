import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export type AuthUser = {
  token: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  avatar: string | null;
};

type AuthContext = {
  authData: AuthUser | null;
  login: (data: AuthUser) => void;
  logout: (message: string) => void;
  checkLoggedIn: () => void;
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

  const checkLoggedIn = () => {
    if (!authData) {
      navigate({ to: "/", state: { message: "Please log in to continue." } });
    }
  };

  const logout = (message: string) => {
    navigate({ to: "/", state: { message } });
    setAuthData(null);
    localStorage.removeItem("authData");
  };

  const login = ({ token, firstName, lastName, gender, avatar }: AuthUser) => {
    const data = { token, firstName, lastName, gender, avatar };
    setAuthData(data);
    localStorage.setItem("authData", JSON.stringify(data));
    navigate({ to: "/home" });
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout, checkLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}
