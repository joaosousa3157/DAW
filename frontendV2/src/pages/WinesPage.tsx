import React, { useEffect, useState } from "react";
import axios from "axios";
import WineCard from "../components/WineCard";
import "../css/winesPage.css";

const WinesPage: React.FC = () => {
  const [winesData, setWinesData] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [filters, setFilters] = useState({
    region: [] as string[],
    type: [] as string[],
    price: [] as string[],
    year: [] as number[],
    rating: [] as number[],
  });

  useEffect(() => {
    const fetchWines = async () => {
      try {
        const response = await axios.get("/api/products?category=wine");
        setWinesData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados dos vinhos:", error);
        setErrorMessage("Não foi possível carregar os vinhos. Tente novamente.");
      }
    };

    fetchWines();
  }, []);

  // Filters
  const regionFilters = ["Alentejo", "Bairrada", "Beira Interior", "Dão", "Douro", "Península de Setúbal", "Tejo"];
  const typeFilters = ["Tinto", "Branco", "Verde"];
  const priceFilters = ["Abaixo de 5€", "5€ - 10€", "10€ - 15€", "15€ - 20€", "20€ - 25€", "Acima de 25€"];
  const ratingFilters = [3, 4, 4.5];
  const yearFilters = Array.from({ length: 11 }, (_, i) => 2013 + i);

  const handleCheckboxChange = (
    filterName: keyof typeof filters,
    value: string | number
  ) => {
    setFilters((prevFilters) => {
      const currentValues = prevFilters[filterName] as (string | number)[];
      return {
        ...prevFilters,
        [filterName]: currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value],
      };
    });
  };

  const filteredWines = winesData.filter((wine) => {
    return (
      (filters.region.length === 0 || filters.region.includes(wine.region)) &&
      (filters.type.length === 0 || filters.type.includes(wine.type)) &&
      (filters.price.length === 0 ||
        (filters.price.includes("Abaixo de 5€") && wine.price < 5) ||
        (filters.price.includes("5€ - 10€") && wine.price >= 5 && wine.price <= 10) ||
        (filters.price.includes("10€ - 15€") && wine.price > 10 && wine.price <= 15) ||
        (filters.price.includes("15€ - 20€") && wine.price > 15 && wine.price <= 20) ||
        (filters.price.includes("20€ - 25€") && wine.price > 20 && wine.price <= 25) ||
        (filters.price.includes("Acima de 25€") && wine.price > 25)) &&
      (filters.rating.length === 0 || filters.rating.some((rating) => wine.rating >= rating)) &&
      (filters.year.length === 0 || filters.year.includes(wine.year))
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
