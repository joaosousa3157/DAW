import React from "react";
import "../css/miscPage.css";
import WineCard from "../components/Winecard";

const MiscPage: React.FC = () => {
  const accessories = [
    {
        id: 1,
      image: "path/to/corkscrew.jpg",
      name: "Saca-rolhas Premium",
      price: 15,
      rating: 4.7,
    },
    {
        id: 2,
      image: "path/to/wineGlass.jpg",
      name: "Conjunto de Taças de Vinho",
      price: 40,
      rating: 4.9,
    },
    {
        id: 3,
      image: "path/to/wineCooler.jpg",
      name: "Resfriador de Vinho",
      price: 25,
      rating: 4.6,
    },
  ];

  return (
    <div className="accessories-page">
      <header className="accessories-header">
        <h1>Acessórios para Vinhos</h1>
        <p>Explore nossa seleção de acessórios que tornam sua experiência com vinho ainda melhor.</p>
      </header>

      <section className="accessories-list">
        <div className="accessories-grid">
          {accessories.map((accessory, index) => (
            <WineCard
              key={index}
              id={accessory.id}
              image={accessory.image}
              name={accessory.name}
              price={accessory.price}
              rating={accessory.rating}
              onAddToCart={() => alert(`Adicionado ao carrinho: ${accessory.name}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MiscPage;
