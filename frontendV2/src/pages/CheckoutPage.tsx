import React from "react";
import { useCheckout } from "../context/CheckoutContext";
import "../css/checkoutPage.css";

const CheckoutPage: React.FC = () => {
  const { checkoutItems } = useCheckout();

  // Function to calculate the total price
  const calculateTotal = () =>
    checkoutItems.reduce((total, item) => total + item.quantity * item.price, 0);

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="cart-items">
        {checkoutItems.length > 0 ? (
          checkoutItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.img} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Price: €{item.price.toFixed(2)}</p>
                <p>Quantity: {item.quantity}</p>
                <p>
                  Subtotal: €{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      {checkoutItems.length > 0 && (
        <div className="cart-summary">
          <h2>Total: €{calculateTotal().toFixed(2)}</h2>
          <button className="checkout-button">Proceed to Payment</button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
