import React from "react";
import { useCheckout } from "../context/CheckoutContext";

// componente para o carrinho
interface CartProps {
  onProceedToPayment: () => void;// funcao pra continuar para o pagamento
}

const Cart: React.FC<CartProps> = ({ onProceedToPayment }) => {
  const { checkoutItems, updateQuantity, removeFromCheckout } = useCheckout();// pega itens do carrinho e funcoes do context

  // calcula o total do carrinho
  const calculateTotal = () =>
    checkoutItems.reduce(
      (total, item) => total + item.quantity * item.price, // soma preco de cada item multiplicado pela quantidade
      0
    );

  return (
    <div>
      <div className="cart-items">
        {checkoutItems.length > 0 ? (  // verifica se o carrinho tem itens
          checkoutItems.map((item) => (  // mapeia cada item do carrinho
            <div className="cart-item" key={item.id}>
              <img src={item.img} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <div className="details">
                  <h3>{item.name}</h3>
                  <p>Preço: €{item.price.toFixed(2)}</p>
                </div>

                <div className="update-and-remove">
                  <div className="quantity-control">
                    <button
                      className="quantity-button"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      -
                    </button>
                    <span className="quantity-input">{item.quantity}</span>
                    <button
                      className="quantity-button"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-item-button"
                    onClick={() => removeFromCheckout(item.id)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>O seu carrinho está vazio.</p>
        )}
      </div>
      {checkoutItems.length > 0 && (
        <div className="cart-summary">
          <h2>Total: €{calculateTotal().toFixed(2)}</h2>
          <button className="checkout-button" onClick={onProceedToPayment}>
            Proceder ao pagamento
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
