import React, { useEffect, useState } from "react";
import "../css/miscPage.css";
import WineCard from "../components/WineCard";
import axios from "axios";

const MiscPage: React.FC = () => {
  const [accessories, setAccessories] = useState<any[]>([]); 
  // estado para armazenar os dados de acessórios

  // useEffect para executar ações ao montar o componente
  useEffect(() => {
    // função assíncrona para buscar os acessórios
    const fetchDeals = async () => {
      try {
        // faz uma requisição para obter os dados da categoria "acessory"
        const response = await axios.get("/api/products?category=acessory");
        setAccessories(response.data); // atualiza o estado com os dados retornados
      } catch (error) {
        console.error("Erro ao buscar os acessorios:", error); 
        // loga qualquer erro que ocorrer durante a requisição
      }
    };

    fetchDeals(); // chama a função de busca ao montar o componente
  }, []); // dependência vazia faz com que essa lógica rode apenas uma vez na montagem

return (
    <div className="accesories-page">
      <header className="accesories-header">
        <h1>Acessórios para Vinhos</h1>
        <p>Explore nossa seleção de acessórios que tornam sua experiência com vinho ainda melhor.</p>
      </header>
      <section className="accesories-list">
        <div className="accesories-grid">
          {accessories.map((deal) => (
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

export default MiscPage;
