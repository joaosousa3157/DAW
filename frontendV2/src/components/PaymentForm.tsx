import React, { useState } from "react";
import axios from "axios";
import { useCheckout } from "../context/CheckoutContext";
import { useUser } from "../context/UserContext";

// Define as props esperadas pelo componente
interface PaymentFormProps {
  onBackToCart: () => void; // funcao pra voltar ao carrinho
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onBackToCart }) => {
  const { checkoutItems, clearCheckout } = useCheckout(); // pega itens do carrinho e funcao pra limpar
  const { user } = useUser(); // pega o usuario logado
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true); // controla endereco de cobranca
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nif: "",
    shippingAddress: "",
    shippingPhone: "",
    billingAddress: "",
    paymentMethod: "",
  }); // estado inicial do formulario
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "error"
  >("pending"); // estado pra status do pagamento
  const [formErrors, setFormErrors] = useState<string[]>([]); // lista de erros de validacao

  // alterna entre usar o endereco de envio como cobranca
  const handleToggleBillingAddress = () => {
    setUseShippingAsBilling(!useShippingAsBilling);
  };

  // atualiza os campos do formulario conforme o usuario digita
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target; // pega o nome e valor do campo
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // atualiza o valor correspondente
    }));
  };

  // calcula o total do carrinho
  const calculateTotal = () =>
    checkoutItems.reduce(
      (total, item) => total + item.quantity * item.price, // soma preco x quantidade de cada item
      0 // valor inicial
    );

  const total = calculateTotal(); // total final
  const now = new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' }); // data e hora atuais no formato PT

  // valida os campos do formulario
  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.firstName) errors.push("Nome próprio é obrigatório.");
    if (!formData.lastName) errors.push("Sobrenome é obrigatório.");
    if (!formData.nif) errors.push("NIF é obrigatório.");
    if (!formData.shippingAddress) errors.push("Endereço de entrega é obrigatório.");
    if (!formData.paymentMethod) errors.push("Método de pagamento é obrigatório.");

    // valida endereco de cobranca caso nao seja o mesmo do envio
    if (!useShippingAsBilling && !formData.billingAddress) {
      errors.push("Endereço de cobrança é obrigatório.");
    }

    return errors; // retorna os erros
  };

  // envia o pedido
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // previne o comportamento padrao do form

    const errors = validateForm(); // valida o formulario
    if (errors.length > 0) {
      setFormErrors(errors); // se tem erro, atualiza o estado
      return;
    }

    setFormErrors([]); // limpa erros caso o form seja valido

    if (!user || !user.id) { // verifica se o usuario esta logado
      setPaymentStatus("error");
      console.error("Usuário não está logado!");
      return;
    }

    const dataToSend = {
      ...formData,
      billingAddress: useShippingAsBilling
        ? formData.shippingAddress // usa o endereco de envio
        : formData.billingAddress, // usa o endereco de cobranca
      cartItems: checkoutItems, // itens do carrinho
      userID: user.id, // id do usuario
      total: total, // total da compra
      dateOfPurchase: now, // data e hora da compra
    };

    try {
      const response = await axios.post("/api/orders", dataToSend); // envia a ordem pro backend

      setPaymentStatus("success"); // sucesso
      clearCheckout(); // limpa o carrinho apos sucesso
      console.log("Pedido enviado com sucesso", response.data);
    } catch (error) {
      setPaymentStatus("error"); // erro
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
