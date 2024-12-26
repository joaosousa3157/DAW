import React from "react";
import "../css/aboutPage.css";

const AboutPage: React.FC = () => {
  return (
    <div className="about-us-page">
      <header className="about-us-header">
        <h1>Sobre Nós</h1>
        <p>
          Na Otis Wines, acreditamos em celebrar os melhores momentos da vida com uma taça de vinho extraordinário.
        </p>
      </header>

      <section className="about-us-story">
        <h2>Nossa História</h2>
        <p>
          A Otis Wines começou com uma paixão por vinhos requintados e uma visão de torná-los acessíveis a todos. 
          De origens humildes em um pequeno vinhedo, crescemos para nos tornar uma comunidade de amantes do vinho que 
          valorizam qualidade, tradição e inovação. Cada garrafa que oferecemos é um testemunho de nossa dedicação 
          à arte da vinificação.
        </p>
      </section>

      <section className="about-us-values">
        <h2>Missão e Valores</h2>
        <ul>
          <li>
            <strong>Qualidade:</strong> Selecionamos apenas os melhores vinhos de vinhedos confiáveis ao redor do mundo.
          </li>
          <li>
            <strong>Inovação:</strong> Combinamos tradição com técnicas modernas para criar experiências únicas.
          </li>
          <li>
            <strong>Comunidade:</strong> Construímos conexões por meio de um amor compartilhado por vinhos excepcionais.
          </li>
        </ul>
      </section>

      <section className="about-us-contact">
        <h2>Contato</h2>
        <p>Tem dúvidas ou deseja entrar em contato? Fale conosco!</p>
        <p>
          <strong>Email:</strong> <a href="mailto:info@otiswines.com">info@otiswines.com</a>
        </p>
        <p>
          <strong>Telefone:</strong> +1 (555) 123-4567
        </p>
        <p>
          <strong>Endereço:</strong> 123 Vineyard Lane, Wine Country, CA 90210
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
