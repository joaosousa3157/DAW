import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface UserContextType {
  user: { email: string } | null;
  login: (userData: { email: string }) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string } | null>(() => {
    // Recupera o usuário do localStorage ao carregar o app
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData: { email: string }) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Salva o usuário no localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove o usuário do localStorage
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
