import React from "react";
import { Link } from "react-router-dom";
import "../css/wineCard.css";

interface WineCardProps {
  id: number;
  image: string;
  name: string;
  price: number;
  rating: number;
  onAddToCart: () => void;
}

const WineCard: React.FC<WineCardProps> = ({
  id,
  image,
  name,
  price,
  rating,
  onAddToCart,
}) => {
  return (
    <div className="wine-card">
      <div className="wine-image-container">
        <Link to={'/wines/' + id}><img src={image} alt={name} className="wine-image" /></Link>
      </div>
      <div className="wine-info">
        <Link to={'/wines/' + id}><h3 className="wine-name">{name}</h3></Link>
        <p className="wine-price">{price.toString() + ' €'}</p>
        <div className="wine-rating">
          {"★".repeat(Math.floor(rating)) + (rating % 1 !== 0 ? "½" : "")}
        </div>
        <button className="add-to-cart-button" onClick={onAddToCart}>
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
};

export default WineCard;
