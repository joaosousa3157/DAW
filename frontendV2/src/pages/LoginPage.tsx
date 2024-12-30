import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // para redirecionar
import { useUser } from "../context/UserContext"; // contexto do user
import "../css/loginPage.css"; // css

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState(""); // email
  const [password, setPassword] = useState(""); // password
  const [errorMessage, setErrorMessage] = useState(""); // msg de erro
  const { login } = useUser(); // login do contexto
  const navigate = useNavigate(); // para redirecionar

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // parar o submit default
  
    if (!email || !password) {
      setErrorMessage("preenche todos os campos"); // valida campos
      return;
    }
  
    try {
      const response = await fetch("/api/users/login", {
        method: "POST", // metodo post
        headers: { "Content-Type": "application/json" }, // tipo json
        body: JSON.stringify({ email, password }), // manda email e password
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // salva no contexto incluindo username
        login({ id: data.user._id, email: data.user.email, username: data.user.username });
        alert("login feito com sucesso"); // msg sucesso
        setErrorMessage(""); // limpa msg erro
        navigate("/"); // vai para home
      } else {
        setErrorMessage(data.error || "erro no login"); // mostra erro do back
      }
    } catch (error) {
      console.error("erro no login:", error); // log do erro
      setErrorMessage("erro, tenta de novo"); // erro generico
    }
  };

  return (
    <div className="login-container">
      <h1>login</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // pega valor
            placeholder="teu email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // pega valor
            placeholder="tua password"
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* mostra erro */}
        <button type="submit" className="login-button">
          login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
