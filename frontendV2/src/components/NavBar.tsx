import React from "react";
import { Link } from "react-router-dom";
import { useCheckout } from "../context/CheckoutContext";
import logo from "../images/logo.png";
import UserIcon from "../images/user.svg";
import CartIcon from "../images/cart.svg";

import "../css/navBar.css";

const NavBar: React.FC = () => {
  const { checkoutItems } = useCheckout(); // pega os itens do carrinho do contexto
  const totalItems = checkoutItems.reduce(
    (sum, item) => sum + item.quantity, // soma todas as quantidades dos itens no carrinho
    0 // valor inicial da soma
  );

  return (
    <nav className="navbar">
      <div className="nav-item logo-container">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo" className="logo-image" />
          <h1 className="logo-title">Otis Wines</h1>
        </Link>
      </div>

      <ul className="nav-item nav-links">
        <li>
          <Link to="wines">Vinhos</Link>
        </li>
        <li>
          <Link to="deals">Packs</Link>
        </li>
        <li>
          <Link to="misc">Acessórios</Link>
        </li>
        <li>
          <Link to="about">Sobre Nós</Link>
        </li>
      </ul>

      <div className="nav-item icons-container">
        <Link to="cart">
        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          <CartIcon className="nav-icon" title="Shopping Cart" />
        </Link>
        <Link to="profile">
          <UserIcon className="nav-icon" title="User Profile" />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
