import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../css/homePage.css";
import WineCard from "../components/WineCard";

const HomePage: React.FC = () => {
  const { user, logout } = useUser(); // Pega o user logado e a função logout
  const navigate = useNavigate(); // Para redirecionar

  const sampleWines = [
    {
      id: "1",
      image: "https://wine.pt/cdn/shop/products/automatico_red_loja_420x.png?v=1592838423",
      name: "Château Margaux",
      price: 200,
      rating: 4.5,
      category: "Red Wine",
      region: "France",
    },
    {
      id: "2",
      image: "https://wine.pt/cdn/shop/products/PlumaAlvarinhoReserva-VinhoBranco-2016_420x.png?v=1711966501",
      name: "Screaming Eagle",
      price: 850,
      rating: 5,
      category: "White Wine",
      region: "USA",
    },
    {
      id: "3",
      image: "https://wine.pt/cdn/shop/products/PlumaAlvarinhoReserva-VinhoBranco-2016_420x.png?v=1711966501",
      name: "Riesling Delight",
      price: 120,
      rating: 4.0,
      category: "White Wine",
      region: "Germany",
    },
    {
      id: "4",
      image: "https://wine.pt/cdn/shop/products/automatico_red_loja_420x.png?v=1592838423",
      name: "Barolo King",
      price: 300,
      rating: 4.8,
      category: "Red Wine",
      region: "Italy",
    },
  ];

  return (
    <div className="home-page">
      {/* Mensagem de boas-vindas personalizada */}
      {user ? (
        <div className="welcome-message">
          <p>
            Olá, <strong>{user.username || user.email}</strong>! Bem-vindo de volta.
          </p>
          <button onClick={logout} className="logout-button">
            Sair
          </button>
        </div>
      ) : (
        <div className="login-message">
          <p>
            Não está logado?{" "}
            <span
              className="login-link"
              onClick={() => navigate("/login")}
              style={{ color: "blue", cursor: "pointer" }}
            >
              Faça Login
            </span>{" "}
            para aproveitar todas as funcionalidades.
          </p>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <h1>Bem-vindo à Otis Wines</h1>
        <p>Explore os melhores vinhos para cada ocasião.</p>
        <a href="/wines" className="explore-button">
          Explore Nossa Coleção
        </a>
      </section>

      {/* Promoções */}
      <section className="promotions">
        <h2>Promoções Especiais</h2>
        <div className="promotion-container">
          <div className="promotion-card">
            <img src="https://via.placeholder.com/150" alt="Promoção 1" />
            <p>Compre 2, leve 1 grátis!</p>
          </div>
          <div className="promotion-card">
            <img src="https://via.placeholder.com/150" alt="Promoção 2" />
            <p>Vinhos selecionados com 20% de desconto.</p>
          </div>
        </div>
      </section>

      {/* Lista de Vinhos */}
      <section className="wine-list">
        <h2>Nossos Vinhos</h2>
        <div className="wine-card-container">
          {sampleWines.map((wine, index) => (
            <WineCard
              key={index}
              id={wine.id}
              image={wine.image}
              name={wine.name}
              price={wine.price}
              rating={wine.rating}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
