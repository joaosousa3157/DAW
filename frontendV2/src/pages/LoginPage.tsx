import React, { useState } from "react";
import "../css/loginPage.css"; // CSS para estilização

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validação básica
    if (!email || !password) {
      setErrorMessage("Please fill in both fields.");
      return;
    }

    try {
      // Verifica se o email já existe no banco de dados
      const emailCheckResponse = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: "__check_only__" }),
      });

      const emailCheckData = await emailCheckResponse.json();

      if (!emailCheckResponse.ok) {
        setErrorMessage(emailCheckData.error || "An error occurred.");
        return;
      }

      if (emailCheckData.error === "Invalid email or password.") {
        // Email não registrado, prosseguir com o registro
        const registerResponse = await fetch("/api/users/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const registerData = await registerResponse.json();

        if (registerResponse.ok) {
          alert("Account created successfully!");
          setErrorMessage("");
        } else {
          setErrorMessage(registerData.error || "Account creation failed.");
        }
      } else {
        setErrorMessage("This email is already registered. Please log in.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
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
          Register
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
