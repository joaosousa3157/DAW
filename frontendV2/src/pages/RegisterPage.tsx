import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/registerPage.css"; // Certifique-se de ter o CSS correspondente.

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // Novo campo
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setErrorMessage("Por favor, insira um email válido.");
      return;
    }

    // Validação básica
    if (!email || !username || !password || !confirmPassword) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    try {
      console.log("Dados enviados ao backend:", { email, username, password });
      // Enviar solicitação ao backend para criar um novo usuário
      const response = await fetch("/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }), // Inclui o username
      });

      console.log("Resposta bruta do servidor:", response);

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Usuário registrado com sucesso!");
        setErrorMessage("");

        setTimeout(() => {
          navigate("/login"); // Redireciona para a página de login
        }, 2000);
        
        setEmail("");
        setUsername(""); // Limpa o username
        setPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await response.json();
        console.error("Erro ao registrar usuário:", errorData);
        setErrorMessage(errorData.error || "Falha ao registrar usuário.");
      }
    } catch (error) {
      console.error("Erro durante o registro:", error);
      setErrorMessage("Ocorreu um erro. Por favor, tente novamente.");
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
            placeholder="Digite seu email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Senha:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua senha"
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
