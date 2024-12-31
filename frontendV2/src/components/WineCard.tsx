import React from "react";
import { Link } from "react-router-dom";
import { useCheckout } from "../context/CheckoutContext";
import "../css/wineCard.css";

interface WineCardProps {
  id: string;
  image: string;
  name: string;
  price: number;
  rating: number;
  onClick?: () => void; // Propriedade opcional para lidar com cliques no card
}

const WineCard: React.FC<WineCardProps> = ({
  id,
  image,
  name,
  price,
  rating,
  onClick, // Desestrutura a propriedade onClick
}) => {
  const { addToCheckout } = useCheckout();

  const handleAddToCart = () => {
    addToCheckout({
      id,
      name,
      price,
      quantity: 1,
      img: image,
    });
  };

  return (
    <div className="wine-card" onClick={onClick}>
      {" "}
      {/* Adiciona suporte para onClick */}
      <div className="wine-image-container">
        <Link to={"/wines/" + id}>
          <img src={image} alt={name} className="wine-image" />
        </Link>
      </div>
      <div className="wine-info">
        <Link to={"/wines/" + id}>
          <h3 className="wine-name">{name}</h3>
        </Link>
        <div className="separator">
          <p className="wine-price">{price.toString() + " €"}</p>
          <div className="wine-rating">
            {"★".repeat(Math.floor(rating)) + (rating % 1 !== 0 ? "½" : "")}
          </div>
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default WineCard;
