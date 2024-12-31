import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useUser } from "./UserContext";

// interface que define os itens do carrinho
interface CheckoutItem {
  id: string; // id do item
  name: string; // nome do item
  price: number; // preco do item
  quantity: number; // quantidade do item
  img: string; // imagem do item
}

// interface que define as funcoes e propriedades do contexto
interface CheckoutContextProps {
  checkoutItems: CheckoutItem[]; // array de itens no carrinho
  addToCheckout: (item: CheckoutItem) => void; // funcao para adicionar item ao carrinho
  removeFromCheckout: (id: string) => void; // funcao para remover item do carrinho
  updateQuantity: (id: string, amount: number) => void; // funcao para atualizar a quantidade de um item
  clearCheckout: () => void; // funcao para limpar o carrinho
}

// cria o contexto do carrinho
const CheckoutContext = createContext<CheckoutContextProps | undefined>(undefined);

// provider que encapsula o estado e as funcoes do carrinho
export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser(); // obtem o usuario logado do contexto
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]); // estado dos itens no carrinho

  // carrega os itens do carrinho do localStorage ao iniciar ou trocar de usuario
  useEffect(() => {
    if (user) {
      const storedItems = localStorage.getItem(`checkoutItems_${user.id}`); // busca pelo id do usuario
      setCheckoutItems(storedItems ? JSON.parse(storedItems) : []); // atualiza os itens do estado
    } else {
      setCheckoutItems([]); // limpa o carrinho se nao houver usuario
    }
  }, [user]);

  // atualiza o localStorage sempre que os itens do carrinho mudam
  useEffect(() => {
    if (user) {
      localStorage.setItem(`checkoutItems_${user.id}`, JSON.stringify(checkoutItems)); // salva no localStorage
    }
  }, [checkoutItems, user]);

  // adiciona um item ao carrinho
  const addToCheckout = (item: CheckoutItem) => {
    setCheckoutItems((prevItems) => {
      const existingItem = prevItems.find((checkoutItem) => checkoutItem.id === item.id); // verifica se ja existe
      if (existingItem) {
        return prevItems.map((checkoutItem) =>
          checkoutItem.id === item.id
            ? { ...checkoutItem, quantity: checkoutItem.quantity + item.quantity } // incrementa a quantidade
            : checkoutItem
        );
      }
      return [...prevItems, item]; // adiciona um novo item
    });
  };

  // remove um item do carrinho
  const removeFromCheckout = (id: string) => {
    setCheckoutItems((prevItems) => prevItems.filter((item) => item.id !== id)); // filtra os itens
  };

  // atualiza a quantidade de um item no carrinho
  const updateQuantity = (id: string, amount: number) => {
    setCheckoutItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(item.quantity + amount, 1) } : item // impede quantidade menor que 1
      )
    );
  };

  // limpa o carrinho, removendo tambem do localStorage
  const clearCheckout = () => {
    setCheckoutItems([]); // limpa o estado
    if (user) {
      localStorage.removeItem(`checkoutItems_${user.id}`); // remove do localStorage
    }
  };

  // retorna o provider do contexto com os valores e funcoes
  return (
    <CheckoutContext.Provider
      value={{ checkoutItems, addToCheckout, removeFromCheckout, updateQuantity, clearCheckout }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

// hook para acessar o contexto do carrinho
export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider"); // erro se usado fora do provider
  }
  return context;
};
