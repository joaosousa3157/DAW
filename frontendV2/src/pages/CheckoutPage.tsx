import React, { useState } from "react";
import "../css/checkoutPage.css";

const CheckoutPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [cartItems] = useState([
    { id: 1, name: "Château Margaux", quantity: 2, price: 200 },
    { id: 2, name: "Screaming Eagle", quantity: 1, price: 850 },
    { id: 2, name: "Screaming Eagle", quantity: 1, price: 850 },
    { id: 2, name: "Screaming Eagle", quantity: 1, price: 850 },


  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Payment Successful! Thank you for your purchase.");
    // Clear cart or redirect to confirmation page
  };

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Cart Summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <span>{item.name} (x{item.quantity})</span>
              <span>${item.price * item.quantity}</span>
            </div>
          ))}
          <hr />
          <div className="cart-total">
            <strong>Total:</strong>
            <strong>${calculateTotal()}</strong>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="checkout-form">
          <h2>Billing Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="zip">ZIP Code</label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <h3>Payment Information</h3>
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="checkout-btn">
              Complete Purchase
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
