import React, { createContext, useState, useContext, ReactNode } from "react";

// tipo do contexto com id e email
interface UserContextType {
  user: { id: string; email: string } | null;
  login: (userData: { id: string; email: string }) => void;
  logout: () => void;
}

// cria o contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // estado inicial do user (tenta recuperar do localStorage)
  const [user, setUser] = useState<{ id: string; email: string } | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null; // carrega o user se existe
  });

  // login salva user no estado e localStorage
  const login = (userData: { id: string; email: string }) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // logout limpa estado e localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// hook para usar o contexto
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
};
