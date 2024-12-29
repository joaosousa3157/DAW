import React, { createContext, useContext, useState, ReactNode } from "react";

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
}

const CheckoutContext = createContext<CheckoutContextProps | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);

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

  return (
    <CheckoutContext.Provider value={{ checkoutItems, addToCheckout }}>
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
