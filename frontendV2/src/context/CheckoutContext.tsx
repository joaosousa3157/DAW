import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
}

const CheckoutContext = createContext<CheckoutContextProps | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
    const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>(() => {
        const storedItems = localStorage.getItem("checkoutItems");
        return storedItems ? JSON.parse(storedItems) : [];
      });
    
      useEffect(() => {
        localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
      }, [checkoutItems]);;

  const addToCheckout = (item: CheckoutItem) => {
    setCheckoutItems((prevItems) => {
      const existingItem = prevItems.find(
        (checkoutItem) => checkoutItem.id === item.id
      );
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
    setCheckoutItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };

  const updateQuantity = (id: string, amount: number) => {
    setCheckoutItems((prevItems) => {
      return prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + amount, 1) } // Impede que a quantidade seja menor que 1
          : item
      );
    });
  };

  return (
    <CheckoutContext.Provider value={{ checkoutItems, addToCheckout, removeFromCheckout, updateQuantity }}>
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
