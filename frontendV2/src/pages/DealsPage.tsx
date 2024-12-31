import React, { useState, useEffect } from "react";
import "../css/dealsPage.css";
import WineCard from "../components/WineCard";
import axios from "axios";

const DealsPage: React.FC = () => {
  const [deals, setDeals] = useState<any[]>([]); // estado para armazenar as ofertas (deals)

  // useEffect usado para executar código ao montar o componente
  useEffect(() => {
    // função assíncrona para buscar as ofertas
    const fetchDeals = async () => {
      try {
        const response = await axios.get("/api/products?category=pack"); // faz uma requisição GET para buscar produtos da categoria "pack"
        setDeals(response.data); // atualiza o estado com os dados recebidos
      } catch (error) {
        console.error("Erro ao buscar os packs:", error); // loga o erro, se acontecer
      }
    };

    fetchDeals(); // chama a função de busca ao montar o componente
  }, []); // dependências vazias para garantir que a busca seja feita apenas uma vez, na montagem do componente


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
