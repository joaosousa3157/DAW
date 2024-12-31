import React, { useState } from "react";
import axios from "axios";
import { useCheckout } from "../context/CheckoutContext";
import { useUser } from "../context/UserContext";

interface PaymentFormProps {
  onBackToCart: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onBackToCart }) => {
  const { checkoutItems, clearCheckout } = useCheckout();
  const { user } = useUser();
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nif: "",
    shippingAddress: "",
    shippingPhone: "",
    billingAddress: "",
    paymentMethod: "",
  });
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const handleToggleBillingAddress = () => {
    setUseShippingAsBilling(!useShippingAsBilling);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const calculateTotal = () =>
    checkoutItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

  const total = calculateTotal();
  const now = new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' });

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.firstName) errors.push("Nome próprio é obrigatório.");
    if (!formData.lastName) errors.push("Sobrenome é obrigatório.");
    if (!formData.nif) errors.push("NIF é obrigatório.");
    if (!formData.shippingAddress)
      errors.push("Endereço de entrega é obrigatório.");
    if (!formData.paymentMethod)
      errors.push("Método de pagamento é obrigatório.");

    if (!useShippingAsBilling && !formData.billingAddress) {
      errors.push("Endereço de cobrança é obrigatório.");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);

    if (!user || !user.id) {
      setPaymentStatus("error");
      console.error("Usuário não está logado!");
      return;
    }

    const dataToSend = {
      ...formData,
      billingAddress: useShippingAsBilling
        ? formData.shippingAddress
        : formData.billingAddress,
      cartItems: checkoutItems,
      userID: user.id,
      total: total,
      dateOfPurchase: now
    };

    try {
      const response = await axios.post("/api/orders", dataToSend);

      setPaymentStatus("success");
      clearCheckout(); // Limpa o carrinho após uma compra bem-sucedida
      console.log("Pedido enviado com sucesso", response.data);
    } catch (error) {
      setPaymentStatus("error");
      console.error("Erro ao enviar o pedido", error);
    }
  };

  if (paymentStatus === "success") {
    return (
      <div className="payment-success">
        <h2>Pagamento Bem Sucedido!</h2>
        <p>
          A sua encomenda foi realizada com sucesso. Obrigado pela sua compra!
        </p>
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
        <p>
          Ocorreu um erro ao processar o seu pagamento. Por favor, tente
          novamente.
        </p>
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
        {formErrors.length > 0 && (
          <div className="form-errors">
            <ul>
              {formErrors.map((error, index) => (
                <li key={index} className="error-message">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

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

        <div className="form-group">
          <label htmlFor="shipping-address">Morada de Entrega</label>
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

        <div className="form-group">
          <label htmlFor="use-shipping-as-billing">
            Utilizar a morada de envio como morada de faturação
          </label>
          <input
            type="checkbox"
            id="use-shipping-as-billing"
            name="use-shipping-as-billing"
            checked={useShippingAsBilling}
            onChange={handleToggleBillingAddress}
          />
        </div>

        {!useShippingAsBilling && (
          <div className="form-group">
            <label htmlFor="billing-address">Morada de Faturação</label>
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
        <button type="submit" className="submit-button">
          Finalizar Pagamento
        </button>
      </form>

      <button className="back-to-cart-button" onClick={onBackToCart}>
        Voltar ao Carrinho
      </button>
    </div>
  );
};

export default PaymentForm;
