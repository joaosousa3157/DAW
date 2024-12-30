import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import para redirecionar
import { useUser } from "../context/UserContext";
import "../css/loginPage.css"; // Add your CSS file for styling

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useUser(); // Acessa o contexto do usuário
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!email || !password) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }
  
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        login({ id: data.user._id, email: data.user.email }); // Passa id e email ao contexto
        alert("Login realizado com sucesso!");
        setErrorMessage("");
      } else {
        setErrorMessage(data.error || "Erro ao fazer login.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErrorMessage("Ocorreu um erro. Tente novamente.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
