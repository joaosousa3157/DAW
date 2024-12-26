import React from "react";
import "../css/homePage.css";
import WineCard from "../components/Winecard";

const HomePage: React.FC = () => {
    const sampleWines = [
        {
          id: 1,
          image: "https://wine.pt/cdn/shop/products/automatico_red_loja_420x.png?v=1592838423",
          name: "Château Margaux",
          price: 200,
          rating: 4.5,
          category: "Red Wine",
          region: "France",
        },
        {
          id: 2,
          image: "https://wine.pt/cdn/shop/products/PlumaAlvarinhoReserva-VinhoBranco-2016_420x.png?v=1711966501",
          name: "Screaming Eagle",
          price: 850,
          rating: 5,
          category: "White Wine",
          region: "USA",
        },
        {
          id: 3,
          image: "https://wine.pt/cdn/shop/products/PlumaAlvarinhoReserva-VinhoBranco-2016_420x.png?v=1711966501",
          name: "Riesling Delight",
          price: 120,
          rating: 4.0,
          category: "White Wine",
          region: "Germany",
        },
        {
          id: 4,
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
            <img src="path/to/promo1.jpg" alt="Promoção 1" />
            <p>Compre 2, leve 1 grátis!</p>
          </div>
          <div className="promotion-card">
            <img src="path/to/promo2.jpg" alt="Promoção 2" />
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
              onAddToCart={() => alert(`Adicionado ao carrinho: ${wine.name}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
