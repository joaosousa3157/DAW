import React, { useState } from "react";
import axios from "axios";
import { useCheckout } from "../context/CheckoutContext"; // Importando o contexto

interface PaymentFormProps {
  onBackToCart: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onBackToCart }) => {
  const { checkoutItems } = useCheckout(); // Acessando os itens do carrinho do contexto
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nif: "",
    shippingAddress: "",
    shippingPhone: "",
    billingAddress: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    paymentMethod: "",
    discountCode: "",
  });
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "error">("pending");
  const [formErrors, setFormErrors] = useState<string[]>([]); // Para armazenar os erros de validação

  const handleToggleBillingAddress = () => {
    setUseShippingAsBilling(!useShippingAsBilling);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    // Verificando se os campos obrigatórios estão preenchidos
    if (!formData.firstName) errors.push("Nome próprio é obrigatório.");
    if (!formData.lastName) errors.push("Sobrenome é obrigatório.");
    if (!formData.nif) errors.push("NIF é obrigatório.");
    if (!formData.shippingAddress) errors.push("Endereço de entrega é obrigatório.");
    if (!formData.shippingPhone) errors.push("Telefone de entrega é obrigatório.");
    if (!formData.cardName) errors.push("Nome no cartão é obrigatório.");
    if (!formData.cardNumber) errors.push("Número do cartão é obrigatório.");
    if (!formData.expiryDate) errors.push("Data de expiração é obrigatória.");
    if (!formData.cvv) errors.push("CVV é obrigatório.");
    if (!formData.paymentMethod) errors.push("Método de pagamento é obrigatório.");

    // Se o endereço de cobrança não for o mesmo de entrega, deve ser preenchido
    if (!useShippingAsBilling && !formData.billingAddress) {
      errors.push("Endereço de cobrança é obrigatório.");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validando o formulário
    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return; // Não envia o formulário se houver erros
    }

    // Limpar erros caso o formulário seja válido
    setFormErrors([]);

    // Prepare data to send in the POST request
    const dataToSend = {
      ...formData,
      billingAddress: useShippingAsBilling ? formData.shippingAddress : formData.billingAddress,
      cartItems: checkoutItems, // Adiciona os itens do carrinho ao corpo da requisição
    };

    try {
      const response = await axios.post("/api/orders", dataToSend);

      // Se o pagamento for bem-sucedido, definir o status como 'success'
      setPaymentStatus("success");
      console.log("Pedido enviado com sucesso", response.data);
    } catch (error) {
      // Se houver erro, definir o status como 'error'
      setPaymentStatus("error");
      console.error("Erro ao enviar o pedido", error);
    }
  };

  if (paymentStatus === "success") {
    return (
      <div className="payment-success">
        <h2>Pagamento Bem Sucedido!</h2>
        <p>A sua encomenda foi realizada com sucesso. Obrigado pela sua compra!</p>
        <button onClick={onBackToCart} className="back-to-cart-button">
          Voltar ao Carrinho
        </button>
      </div>
    );
  }

  if (paymentStatus === "error") {
    return (
      <div className="payment-error">
        <h2>Erro no Pagamento</h2>
        <p>Ocorreu um erro ao processar o seu pagamento. Por favor, tente novamente.</p>
        <button onClick={onBackToCart} className="back-to-cart-button">
          Voltar ao Carrinho
        </button>
      </div>
    );
  }

  return (
    <div className="payment-form">
      <h2>Formulário de Pagamento</h2>
      <form onSubmit={handleSubmit}>
        {/* Exibindo os erros de validação */}
        {formErrors.length > 0 && (
          <div className="form-errors">
            <ul>
              {formErrors.map((error, index) => (
                <li key={index} className="error-message">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Personal Details */}
        <div className="form-group">
          <label htmlFor="first-name">Nome Próprio</label>
          <input
            type="text"
            id="first-name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="last-name">Sobrenome</label>
          <input
            type="text"
            id="last-name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
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
            value={formData.nif}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>

        {/* Shipping Address */}
        <div className="form-group">
          <label htmlFor="shipping-address">Endereço de Entrega</label>
          <textarea
            id="shipping-address"
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleInputChange}
            required
            className="form-input"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="shipping-phone">Telefone</label>
          <input
            type="text"
            id="shipping-phone"
            name="shippingPhone"
            value={formData.shippingPhone}
            onChange={handleInputChange}
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
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleInputChange}
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
            name="cardName"
            value={formData.cardName}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="card-number">Número do Cartão</label>
          <input
            type="text"
            id="card-number"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="expiry-date">Data de Expiração</label>
          <input
            type="text"
            id="expiry-date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
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
            value={formData.cvv}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>

        {/* Payment Method Selection */}
        <div className="form-group">
          <label>Pagamento</label>
          <div>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === "card"}
                onChange={handleInputChange}
                required
              />
              Cartão de Crédito
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={formData.paymentMethod === "paypal"}
                onChange={handleInputChange}
                required
              />
              PayPal
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="multibanco"
                checked={formData.paymentMethod === "multibanco"}
                onChange={handleInputChange}
                required
              />
              Multibanco
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="mb-way"
                checked={formData.paymentMethod === "mb-way"}
                onChange={handleInputChange}
                required
              />
              MB WAY
            </label>
          </div>
        </div>

        {/* Discount Code */}
        <div className="form-group">
          <label htmlFor="discount-code">Código de Desconto ou Cartão de Oferta</label>
          <input
            type="text"
            id="discount-code"
            name="discountCode"
            value={formData.discountCode}
            onChange={handleInputChange}
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
