import React from "react";
import "../css/dealsPage.css";
import WineCard from "../components/Winecard";

const DealsPage: React.FC = () => {
  // Dados fictícios para exibir os produtos em promoção
  const deals = [
    {
      id: 1,
      image: "https://via.placeholder.com/300",
      name: "Wine A - 50% Off",
      price: 25,
      rating: 4.5,
    },
    {
      id: 2,
      image: "https://via.placeholder.com/300",
      name: "Wine B - Buy 1 Get 1 Free",
      price: 30,
      rating: 4.8,
    },
    {
      id: 3,
      image: "https://via.placeholder.com/300",
      name: "Wine C - 30% Off",
      price: 20,
      rating: 4.3,
    },
  ];

  return (
    <div className="deals-page">
      <header className="deals-header">
        <h1>Promoções</h1>
        <p>Descubra os melhores vinhos em promoção para aproveitar!</p>
      </header>
      <section className="deals-list">
        <div className="deals-grid">
          {deals.map((deal) => (
            <WineCard
              key={deal.id}
              id={deal.id}
              image={deal.image}
              name={deal.name}
              price={deal.price}
              rating={deal.rating}
              onAddToCart={() => alert(`Adicionado ao carrinho: ${deal.name}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DealsPage;
