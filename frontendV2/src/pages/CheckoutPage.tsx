import React, { useState } from "react";
import Cart from "../components/Cart";
import PaymentForm from "../components/PaymentForm";
import "../css/checkoutPage.css";

const CheckoutPage: React.FC = () => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      {!showPaymentForm ? (
        <Cart onProceedToPayment={() => setShowPaymentForm(true)} />
      ) : (
        <PaymentForm onBackToCart={() => setShowPaymentForm(false)} />
      )}
    </div>
  );
};

export default CheckoutPage;
