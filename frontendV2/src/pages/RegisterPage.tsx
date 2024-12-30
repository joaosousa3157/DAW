import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // usado para redirecionar apos registro
import "../css/registerPage.css";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState(""); // armazena o email do user
  const [username, setUsername] = useState(""); // armazena o username do user
  const [password, setPassword] = useState(""); // armazena a senha
  const [confirmPassword, setConfirmPassword] = useState(""); // armazena a confirmacao da senha
  const [errorMessage, setErrorMessage] = useState(""); // exibe mensagem de erro
  const [successMessage, setSuccessMessage] = useState(""); // exibe mensagem de sucesso
  const navigate = useNavigate(); // redireciona o user

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // valida estrutura do email
    return emailRegex.test(email);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // previne recarregamento da pagina

    if (!isValidEmail(email)) {
      setErrorMessage("Por favor, insira um email valido."); // erro se o email for invalido
      return;
    }

    if (!email || !username || !password || !confirmPassword) {
      setErrorMessage("Por favor, preencha todos os campos."); // erro se faltar campo
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas nao coincidem."); // erro se as senhas nao baterem
      return;
    }

    try {
      console.log("Dados enviados ao backend:", { email, username, password });

      const response = await fetch("/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }), // envia os dados para o backend
      });

      console.log("Resposta bruta do servidor:", response);

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Usuario registrado com sucesso!");
        setErrorMessage("");

        setTimeout(() => {
          navigate("/login"); // redireciona para login apos sucesso
        }, 2000);

        // limpa os campos do formulario
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await response.json();
        console.error("Erro ao registrar usuario:", errorData);
        setErrorMessage(errorData.error || "Falha ao registrar usuario.");
      }
    } catch (error) {
      console.error("Erro durante o registro:", error);
      setErrorMessage("Ocorreu um erro. Por favor, tente novamente."); // mensagem generica para erros
    }
  };

  return (
    <div className="register-container">
      <h1>Registro</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email" // placeholder para email
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu username" // placeholder para username
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha" // placeholder para senha
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Senha:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua senha" // placeholder para confirmar senha
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>} 
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" className="register-button">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
