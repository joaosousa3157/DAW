import React, { useEffect, useState } from "react";
import axios from "axios";
import WineCard from "../components/WineCard";
import "../css/winesPage.css";

const WinesPage: React.FC = () => {

  const [winesData, setWinesData] = useState([]);

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
        const response = await axios.get("http://localhost:3000/api/wines"); // Replace with your API URL
        setWinesData(response.data);
      } catch (error) {
        console.error("Error fetching wines data:", error);
      }
    };

    fetchWines();
  }, []);



const handleCheckboxChange = (
  filterName: keyof typeof filters,
  value: string | number
) => {
  setFilters((prevFilters) => {
    const currentValues = prevFilters[filterName] as (string | number)[];
    if (currentValues.includes(value)) {
      // Remover o valor se já está incluído
      return {
        ...prevFilters,
        [filterName]: currentValues.filter((v) => v !== value),
      };
    } else {
      // Adicionar o valor ao array
      return {
        ...prevFilters,
        [filterName]: [...currentValues, value],
      };
    }
  });
};

  const filteredWines = winesData.filter((wine) => {
    return (
      (filters.region.length === 0 || filters.region.includes(wine.region)) &&
      (filters.type.length === 0 || filters.type.includes(wine.category)) &&
      (filters.price.length === 0 ||
        (filters.price.includes("Below $50") && wine.price < 50) ||
        (filters.price.includes("$50-$200") && wine.price >= 50 && wine.price <= 200) ||
        (filters.price.includes("Above $200") && wine.price > 200)) &&
      (filters.rating.length === 0 ||
        filters.rating.some((rating) => wine.rating >= rating))
    );
  });

  return (
    <div className="product-page">
      {/* Sidebar Filters */}
      <aside className="sidebar">
        <h3>Filters</h3>

        {/* Region Filter */}
        <fieldset>
          <legend>Região</legend>
          {["Alentejo", "Bairrada", "Beira Interior", "Dão", "Douro", "Península de Setúbal", "Tejo"].map((region) => (
            <label key={region}>
              <input
                type="checkbox"
                value={region}
                checked={filters.region.includes(region)}
                onChange={(e) =>
                  handleCheckboxChange("region", e.target.value)
                }
              />
              {region}
            </label>
          ))}
        </fieldset>

        {/* Category Filter */}
        <fieldset>
          <legend>Tipo</legend>
          {["Tinto", "Branco", "Verde"].map((category) => (
            <label key={category}>
              <input
                type="checkbox"
                value={category}
                checked={filters.type.includes(category)}
                onChange={(e) =>
                  handleCheckboxChange("type", e.target.value)
                }
              />
              {category}
            </label>
          ))}
        </fieldset>

        {/* Price Filter */}
        <fieldset>
          <legend>Price</legend>
          {["Abaixo de 5€", "5€ - 10€", "10€ - 15€", "15€ - 20€", "20€ - 25€", "Acima de 25€"].map((priceRange) => (
            <label key={priceRange}>
              <input
                type="checkbox"
                value={priceRange}
                checked={filters.price.includes(priceRange)}
                onChange={(e) =>
                  handleCheckboxChange("price", e.target.value)
                }
              />
              {priceRange}
            </label>
          ))}
        </fieldset>

        {/* Rating Filter */}
        <fieldset>
          <legend>Rating</legend>
          {[3, 4, 4.5].map((rating) => (
            <label key={rating}>
              <input
                type="checkbox"
                value={rating}
                checked={filters.rating.includes(rating)}
                onChange={(e) =>
                  handleCheckboxChange("rating", parseFloat(e.target.value))
                }
              />
              {rating} stars or more
            </label>
          ))}
        </fieldset>
      </aside>

      {/* Wines Grid */}
      <main className="products-grid">
        {filteredWines.length > 0 ? (
          filteredWines.map((wine) => (
            <WineCard
              key={wine.id}
              id={wine.id}
              image={wine.image}
              name={wine.name}
              price={wine.price}
              rating={wine.rating}
              onAddToCart={() => alert(`${wine.name} added to cart!`)}
            />
          ))
        ) : (
          <p>No wines match the selected filters.</p>
        )}
      </main>
    </div>
  );
};

export default WinesPage;
