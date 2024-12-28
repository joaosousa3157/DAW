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

    // Simple validation
    if (!email || !password) {
      setErrorMessage("Please fill in both fields.");
      return;
    }

    try {
      // Realiza a requisição para o back-end
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login({ email }); // Atualiza o contexto com o usuário logado
        navigate("/"); // Redireciona para a página Home
        setErrorMessage("");
        // Adicione lógica adicional aqui (ex: redirecionamento ou armazenamento de token)
      } else {
        setErrorMessage(data.error || "Login failed.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred. Please try again.");
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
