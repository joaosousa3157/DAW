import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useUser } from "./UserContext";

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  img: string;
}

interface CheckoutContextProps {
  checkoutItems: CheckoutItem[];
  addToCheckout: (item: CheckoutItem) => void;
  removeFromCheckout: (id: string) => void;
  updateQuantity: (id: string, amount: number) => void;
  clearCheckout: () => void; // Adicionando a função de limpar o carrinho
}

const CheckoutContext = createContext<CheckoutContextProps | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser(); // Obter o usuário logado do contexto
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);

  // Carregar o carrinho ao inicializar ou ao trocar de usuário
  useEffect(() => {
    if (user) {
      const storedItems = localStorage.getItem(`checkoutItems_${user.id}`);
      setCheckoutItems(storedItems ? JSON.parse(storedItems) : []);
    } else {
      setCheckoutItems([]); // Limpar o carrinho se não houver usuário logado
    }
  }, [user]);

  // Atualizar o localStorage sempre que o carrinho mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem(`checkoutItems_${user.id}`, JSON.stringify(checkoutItems));
    }
  }, [checkoutItems, user]);

  const addToCheckout = (item: CheckoutItem) => {
    setCheckoutItems((prevItems) => {
      const existingItem = prevItems.find((checkoutItem) => checkoutItem.id === item.id);
      if (existingItem) {
        return prevItems.map((checkoutItem) =>
          checkoutItem.id === item.id
            ? { ...checkoutItem, quantity: checkoutItem.quantity + item.quantity }
            : checkoutItem
        );
      }
      return [...prevItems, item];
    });
  };

  const removeFromCheckout = (id: string) => {
    setCheckoutItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, amount: number) => {
    setCheckoutItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(item.quantity + amount, 1) } : item
      )
    );
  };

  const clearCheckout = () => {
    setCheckoutItems([]);
    if (user) {
      localStorage.removeItem(`checkoutItems_${user.id}`);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{ checkoutItems, addToCheckout, removeFromCheckout, updateQuantity, clearCheckout }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};
