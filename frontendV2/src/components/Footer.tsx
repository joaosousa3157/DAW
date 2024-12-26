import React from "react";
import { Link } from "react-router-dom";
import "../css/footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <h2>Otis Wines</h2>
          <p>Celebrando os melhores momentos da vida com vinhos requintados desde 2024.</p>
        </div>

        <div className="footer-links">
          <h3>Links Rápidos</h3>
          <ul>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/about">Sobre Nós</Link></li>
            <li><Link to="/wines">Nossos Vinhos</Link></li>
            <li><Link to="/deals">Promoções</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contato</h3>
          <p>Email: <a href="mailto:info@otiswines.com">info@otiswines.com</a></p>
          <p>Telefone: +1 (555) 123-4567</p>
          <p>Endereço: 123 Vineyard Lane, Wine Country, CA 90210</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Otis Wines. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
