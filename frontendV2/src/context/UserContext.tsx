import React, { createContext, useState, useContext, ReactNode } from "react";

// Definição do tipo de contexto
interface UserContextType {
  user: { id: string; email: string } | null; // Incluímos o id
  login: (userData: { id: string; email: string }) => void;
  logout: () => void;
}

// Criação do contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado inicial do usuário (recupera do localStorage se disponível)
  const [user, setUser] = useState<{ id: string; email: string } | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null; // Garante que id e email estão disponíveis
  });

  // Função de login
  const login = (userData: { id: string; email: string }) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Salva id e email no localStorage
  };

  // Função de logout
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

// Hook personalizado para acessar o contexto
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
};
