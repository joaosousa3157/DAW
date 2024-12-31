import React from "react";
import { Link } from "react-router-dom";
import { useCheckout } from "../context/CheckoutContext";
import "../css/wineCard.css";

// interface para definir as propriedades aceitas pelo componente
interface WineCardProps {
  id: string; // id do vinho
  image: string; // url da imagem do vinho
  name: string; // nome do vinho
  price: number; // preco do vinho
  rating: number; // avaliacao do vinho
  onClick?: () => void; // funcao opcional para lidar com cliques no card
}

// componente que renderiza um card de vinho
const WineCard: React.FC<WineCardProps> = ({
  id, // id do vinho
  image, // url da imagem
  name, // nome do vinho
  price, // preco
  rating, // avaliacao
  onClick, // funcao opcional de clique
}) => {
  const { addToCheckout } = useCheckout(); // hook do contexto do carrinho

  // funcao que adiciona o vinho ao carrinho
  const handleAddToCart = () => {
    addToCheckout({
      id, // id do vinho
      name, // nome do vinho
      price, // preco
      quantity: 1, // adiciona uma unidade
      img: image, // url da imagem
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
