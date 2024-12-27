import React, { useState } from "react";
import "../css/loginPage.css"; // Add your CSS file for styling

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

  // Simple validation
  if (!email || !password) {
    setErrorMessage("Please fill in both fields.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/users/login", { //trocar a porta para a do back end que está a dar erro pois usam os 2 a mesma porta
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful!");
      setErrorMessage("");
      // Adicionar lógica para redirecionar ou armazenar dados do usuário
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
