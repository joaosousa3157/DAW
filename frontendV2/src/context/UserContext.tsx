import React, { createContext, useState, useContext, ReactNode } from "react";

// tipo do contexto com id, email e username
interface UserContextType {
  user: { id: string; email: string; username: string } | null;
  login: (userData: Partial<{ id: string; email: string; username: string }>) => void;
  logout: () => void;
}

// cria o contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // estado inicial do user (tenta recuperar do localStorage)
  const [user, setUser] = useState<{ id: string; email: string; username: string } | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null; // carrega o user se existe
  });

  // login salva user no estado e localStorage
  const login = (userData: Partial<{ id: string; email: string; username: string }>) => {
    const updatedUser = { ...user, ...userData }; // mescla o estado atual com os novos dados
    setUser(updatedUser); // atualiza o estado global
    localStorage.setItem("user", JSON.stringify(updatedUser)); // salva no localStorage
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
