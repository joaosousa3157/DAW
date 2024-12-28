import React, { useEffect, useState } from "react";
import axios from "axios";
import WineCard from "../components/WineCard";
import "../css/winesPage.css";

const handleAddToCart = (wine) => {
  alert(`${wine.name} added to cart!`);
};

const WinesPage: React.FC = () => {
  const [winesData, setWinesData] = useState([]);

  useEffect(() => {
    const fetchWines = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products?category=wine");
        setWinesData(response.data);
      } catch (error) {
        console.error("Error fetching wines data:", error);
      }
    };

    fetchWines();
  }, []);

  const regionFilters = [
    "Alentejo",
    "Bairrada",
    "Beira Interior",
    "Dão",
    "Douro",
    "Península de Setúbal",
    "Tejo",
  ];

  const typeFilters = ["Tinto", "Branco", "Verde"];

  const priceFilters = [
    "Abaixo de 5€",
    "5€ - 10€",
    "10€ - 15€",
    "15€ - 20€",
    "20€ - 25€",
    "Acima de 25€",
  ];

  const ratingFilters = [3, 4, 4.5];

  const yearFilters = [
    2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016,
    2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024
  ];

  const [filters, setFilters] = useState({
    region: [] as string[],
    type: [] as string[],
    price: [] as string[],
    year: [] as number[],
    rating: [] as number[],
  });

  const filteredWines = winesData.filter((wine) => {
    return (
      (filters.region.length === 0 || filters.region.includes(wine.region)) &&
      (filters.type.length === 0 || filters.type.includes(wine.type)) &&
      (filters.price.length === 0 ||
        (filters.price.includes("Abaixo de 5€") && wine.price < 5) ||
        (filters.price.includes("5€ - 10€") &&
          wine.price >= 5 &&
          wine.price <= 10) ||
        (filters.price.includes("10€ - 15€") &&
          wine.price > 10 &&
          wine.price <= 15) ||
        (filters.price.includes("15€ - 20€") &&
          wine.price > 15 &&
          wine.price <= 20) ||
        (filters.price.includes("20€ - 25€") &&
          wine.price > 20 &&
          wine.price <= 25) ||
        (filters.price.includes("Acima de 25€") && wine.price > 25)) &&
      (filters.rating.length === 0 ||
        filters.rating.some((rating) => wine.rating >= rating)) &&
      (filters.year.length === 0 || filters.year.includes(wine.year))
    );
  });

  const handleCheckboxChange = (
    filterName: keyof typeof filters,
    value: string | number
  ) => {
    setFilters((prevFilters) => {
      const currentValues = prevFilters[filterName] as (string | number)[];
      if (currentValues.includes(value)) {
        return {
          ...prevFilters,
          [filterName]: currentValues.filter((v) => v !== value),
        };
      } else {
        return {
          ...prevFilters,
          [filterName]: [...currentValues, value],
        };
      }
    });
  };

  return (
    <div className="product-page">
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
              onAddToCart={() => handleAddToCart(wine)}
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