import React, { useState } from "react";

interface PaymentFormProps {
  onBackToCart: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onBackToCart }) => {
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(false);
  
  const handleToggleBillingAddress = () => {
    setUseShippingAsBilling(!useShippingAsBilling);
  };

  return (
    <div className="payment-form">
      <h2>Formulário de Pagamento</h2>
      <form>
        {/* Personal Details */}
        <div className="form-group">
          <label htmlFor="first-name">Nome Próprio</label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="last-name">Sobrenome</label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="nif">NIF</label>
          <input
            type="text"
            id="nif"
            name="nif"
            required
            className="form-input"
          />
        </div>

        {/* Shipping Address */}
        <div className="form-group">
          <label htmlFor="shipping-address">Endereço de Entrega</label>
          <textarea
            id="shipping-address"
            name="shipping-address"
            required
            className="form-input"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="shipping-phone">Telefone</label>
          <input
            type="text"
            id="shipping-phone"
            name="shipping-phone"
            required
            className="form-input"
          />
        </div>
        
        {/* Billing Address */}
        <div className="form-group">
          <input
            type="checkbox"
            id="use-shipping-as-billing"
            name="use-shipping-as-billing"
            checked={useShippingAsBilling}
            onChange={handleToggleBillingAddress}
          />
          <label htmlFor="use-shipping-as-billing">Utilizar o endereço de envio como endereço de faturação</label>
        </div>

        {!useShippingAsBilling && (
          <div className="form-group">
            <label htmlFor="billing-address">Endereço de Cobrança</label>
            <textarea
              id="billing-address"
              name="billing-address"
              required
              className="form-input"
            ></textarea>
          </div>
        )}

        {/* Payment Details */}
        <div className="form-group">
          <label htmlFor="card-name">Nome no Cartão</label>
          <input
            type="text"
            id="card-name"
            name="card-name"
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="card-number">Número do Cartão</label>
          <input
            type="text"
            id="card-number"
            name="card-number"
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="expiry-date">Data de Expiração</label>
          <input
            type="text"
            id="expiry-date"
            name="expiry-date"
            placeholder="MM/AA"
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cvv">CVV</label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            required
            className="form-input"
          />
        </div>

        {/* Payment Method Selection */}
        <div className="form-group">
          <label>Pagamento</label>
          <div>
            <label>
              <input type="radio" name="payment-method" value="card" /> Cartão de Crédito
            </label>
            <label>
              <input type="radio" name="payment-method" value="paypal" /> PayPal
            </label>
            <label>
              <input type="radio" name="payment-method" value="multibanco" /> Multibanco
            </label>
            <label>
              <input type="radio" name="payment-method" value="mb-way" /> MB WAY
            </label>
          </div>
        </div>

        {/* Discount Code */}
        <div className="form-group">
          <label htmlFor="discount-code">Código de Desconto ou Cartão de Oferta</label>
          <input
            type="text"
            id="discount-code"
            name="discount-code"
            className="form-input"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Finalizar Pagamento
        </button>
      </form>
      
      {/* Back to Cart Button */}
      <button className="back-to-cart-button" onClick={onBackToCart}>
        Voltar ao Carrinho
      </button>
    </div>
  );
};

export default PaymentForm;
