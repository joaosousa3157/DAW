import React from "react";
import { useCheckout } from "../context/CheckoutContext";

interface CartProps {
  onProceedToPayment: () => void;
}

const Cart: React.FC<CartProps> = ({ onProceedToPayment }) => {
  const { checkoutItems, updateQuantity, removeFromCheckout } = useCheckout();

  const calculateTotal = () =>
    checkoutItems.reduce((total, item) => total + item.quantity * item.price, 0);

  return (
    <div>
      <div className="cart-items">
        {checkoutItems.length > 0 ? (
          checkoutItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img
                src={item.img}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Preço: €{item.price.toFixed(2)}</p>
                <p>Subtotal: €{(item.price * item.quantity).toFixed(2)}</p>
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
