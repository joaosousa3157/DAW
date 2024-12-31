import React, { useState, useEffect } from "react";
import "../css/dealsPage.css";
import WineCard from "../components/WineCard";
import axios from "axios";

const DealsPage: React.FC = () => {
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await axios.get("/api/products?category=pack");
        setDeals(response.data);
      } catch (error) {
        console.error("Erro ao buscar os packs:", error);
      }
    };

    fetchDeals();
  }, []);

  return (
    <div className="deals-page">
      <header className="deals-header">
        <h1>Packs</h1>
        <p>Descubra os melhores vinhos em promoção para aproveitar!</p>
      </header>
      <section className="deals-list">
        <div className="deals-grid">
          {deals.map((deal) => (
            <WineCard
              key={deal._id}
              id={deal._id}
              image={deal.image}
              name={deal.name}
              price={deal.price}
              rating={deal.rating}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DealsPage;
