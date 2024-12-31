import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WineCard from "../components/WineCard";
import axios from "axios";
import "../css/homePage.css";

const HomePage: React.FC = () => {
  const [packs, setPacks] = useState([]); // estado para armazenar os dados de "packs"
  const [tintos, setTintos] = useState([]); // estado para armazenar os dados de vinhos tintos
  const [brancos, setBrancos] = useState([]); // estado para armazenar os dados de vinhos brancos

  // useEffect para realizar uma ação ao montar o componente
  useEffect(() => {
    // função assíncrona para buscar dados
    const fetchData = async () => {
      try {
        // busca os dados da categoria "pack"
        const packResponse = await axios.get("/api/products?category=pack");
        setPacks(packResponse.data.slice(0, 4)); // atualiza o estado com os primeiros 4 itens

        // busca os dados de vinhos tintos
        const tintosResponse = await axios.get(
          "/api/products?category=wine&type=Tinto"
        );
        setTintos(tintosResponse.data.slice(0, 4)); // atualiza o estado com os primeiros 4 itens

        // busca os dados de vinhos brancos
        const brancosResponse = await axios.get(
          "/api/products?category=wine&type=Branco"
        );
        setBrancos(brancosResponse.data.slice(0, 4)); // atualiza o estado com os primeiros 4 itens
      } catch (error) {
        console.error("Error fetching data:", error); // loga qualquer erro ocorrido nas requisições
      }
    };

    fetchData(); // chama a função de busca ao montar o componente
  }, []); // dependências vazias garantem que essa lógica só roda uma vez na montagem


  return (
    <div className="home-page">
      <div className="banner">
        <h1>Bem-vindo à Otis Wines</h1>
        <p>Explore os melhores vinhos para cada ocasião.</p>
        <Link to="wines" className="explore-button">
          Explore Nossa Coleção
        </Link>
      </div>
        <div className="sections">
        <div className="packs-section">
        <h2>Packs Especiais</h2>
        <div className="wine-card-container">
          {packs.map((pack) => (
            <WineCard
              key={pack._id}
              id={pack._id}
              image={pack.image}
              name={pack.name}
              price={pack.price}
              rating={pack.rating}
            />
          ))}
        </div>
      </div>

      <div className="tintos-section">
        <h2>Vinhos Tintos</h2>
        <div className="wine-card-container">
          {tintos.map((tinto) => (
            <WineCard
              key={tinto._id}
              id={tinto._id}
              image={tinto.image}
              name={tinto.name}
              price={tinto.price}
              rating={tinto.rating}
            />
          ))}
        </div>
      </div>

      <div className="brancos-section">
        <h2>Vinhos Brancos</h2>
        <div className="wine-card-container">
          {brancos.map((branco) => (
            <WineCard
              key={branco._id}
              id={branco._id}
              image={branco.image}
              name={branco.name}
              price={branco.price}
              rating={branco.rating}
            />
          ))}
        </div>
      </div>
        </div>

    </div>
  );
};

export default HomePage;
