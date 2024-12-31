import React, { useEffect, useState } from "react";
import axios from "axios";
import WineCard from "../components/WineCard";
import "../css/winesPage.css";

const WinesPage: React.FC = () => {
  // estado para armazenar os dados dos vinhos
  const [winesData, setWinesData] = useState<any[]>([]);
  // estado para armazenar mensagens de erro
  const [errorMessage, setErrorMessage] = useState("");
  // estado para os filtros aplicados
  const [filters, setFilters] = useState({
    region: [] as string[], // filtro por regiao
    type: [] as string[], // filtro por tipo
    price: [] as string[], // filtro por faixa de preco
    year: [] as number[], // filtro por ano
    rating: [] as number[], // filtro por avaliacao
  });

  // busca os dados dos vinhos quando a pagina carrega
  useEffect(() => {
    const fetchWines = async () => {
      try {
        const response = await axios.get("/api/products?category=wine"); // faz a requisicao para a API
        setWinesData(response.data); // armazena os dados recebidos
      } catch (error) {
        console.error("Erro ao buscar dados dos vinhos:", error); // loga o erro
        setErrorMessage("Nao foi possivel carregar os vinhos. Tente novamente."); // mensagem de erro
      }
    };

    fetchWines(); // executa a busca
  }, []);

  // definicao dos filtros disponiveis
  const regionFilters = ["Alentejo", "Bairrada", "Beira Interior", "Dão", "Douro", "Península de Setúbal", "Tejo"]; // regioes
  const typeFilters = ["Tinto", "Branco", "Verde"]; // tipos de vinho
  const priceFilters = ["Abaixo de 5€", "5€ - 10€", "10€ - 15€", "15€ - 20€", "20€ - 25€", "Acima de 25€"]; // faixas de preco
  const ratingFilters = [3, 4, 4.5]; // notas minimas
  const yearFilters = Array.from({ length: 11 }, (_, i) => 2013 + i); // anos de producao

  // funcao para lidar com alteracoes nos filtros
  const handleCheckboxChange = (
    filterName: keyof typeof filters, // nome do filtro
    value: string | number // valor do filtro
  ) => {
    setFilters((prevFilters) => {
      const currentValues = prevFilters[filterName] as (string | number)[]; // pega os valores atuais do filtro
      return {
        ...prevFilters,
        [filterName]: currentValues.includes(value)
          ? currentValues.filter((v) => v !== value) // remove o valor se ja estiver selecionado
          : [...currentValues, value], // adiciona o valor se nao estiver selecionado
      };
    });
  };

  // aplica os filtros aos dados dos vinhos
  const filteredWines = winesData.filter((wine) => {
    return (
      (filters.region.length === 0 || filters.region.includes(wine.region)) && // filtra por regiao
      (filters.type.length === 0 || filters.type.includes(wine.type)) && // filtra por tipo
      (filters.price.length === 0 || // filtra por preco
        (filters.price.includes("Abaixo de 5€") && wine.price < 5) || 
        (filters.price.includes("5€ - 10€") && wine.price >= 5 && wine.price <= 10) ||
        (filters.price.includes("10€ - 15€") && wine.price > 10 && wine.price <= 15) ||
        (filters.price.includes("15€ - 20€") && wine.price > 15 && wine.price <= 20) ||
        (filters.price.includes("20€ - 25€") && wine.price > 20 && wine.price <= 25) ||
        (filters.price.includes("Acima de 25€") && wine.price > 25)) &&
      (filters.rating.length === 0 || filters.rating.some((rating) => wine.rating >= rating)) && // filtra por avaliacao
      (filters.year.length === 0 || filters.year.includes(wine.year)) // filtra por ano
    );
  });


  return (
    <div className="product-page">
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="sidebar">
        <div className="region-filter">
          <legend>Região</legend>
          {regionFilters.map((region) => (
            <label key={region}>
              <input
                type="checkbox"
                value={region}
                checked={filters.region.includes(region)}
                onChange={(e) => handleCheckboxChange("region", e.target.value)}
              />
              {region}
            </label>
          ))}
        </div>
        <div className="type-filter">
          <legend>Tipo</legend>
          {typeFilters.map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                value={type}
                checked={filters.type.includes(type)}
                onChange={(e) => handleCheckboxChange("type", e.target.value)}
              />
              {type}
            </label>
          ))}
        </div>
        <div className="price-filter">
          <legend>Preço</legend>
          {priceFilters.map((price) => (
            <label key={price}>
              <input
                type="checkbox"
                value={price}
                checked={filters.price.includes(price)}
                onChange={(e) => handleCheckboxChange("price", e.target.value)}
              />
              {price}
            </label>
          ))}
        </div>
        <div className="year-filter">
          <legend>Ano</legend>
          {yearFilters.map((year) => (
            <label key={year}>
              <input
                type="checkbox"
                value={year}
                checked={filters.year.includes(year)}
                onChange={(e) => handleCheckboxChange("year", Number(e.target.value))}
              />
              {year}
            </label>
          ))}
        </div>
        <div className="rating-filter">
          <legend>Classificação</legend>
          {ratingFilters.map((rating) => (
            <label key={rating}>
              <input
                type="checkbox"
                value={rating}
                checked={filters.rating.includes(rating)}
                onChange={(e) => handleCheckboxChange("rating", Number(e.target.value))}
              />
              {rating}
            </label>
          ))}
        </div>
      </div>
      <div className="products-grid">
        {filteredWines.length > 0 ? (
          filteredWines.map((wine) => (
            <WineCard
              key={wine._id}
              id={wine._id}
              image={wine.image}
              name={wine.name}
              price={wine.price}
              rating={wine.rating}
            />
          ))
        ) : (
          <p>Nenhum vinho corresponde aos filtros selecionados</p>
        )}
      </div>
    </div>
  );
};

export default WinesPage;
