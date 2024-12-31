import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// componente que rola a janela para o topo ao mudar de rota
const ScrollToTop = () => {
  const { pathname } = useLocation(); // pega o caminho atual da URL

  useEffect(() => {
    window.scrollTo(0, 0); // rola para o topo da pagina
  }, [pathname]); // executa toda vez que o caminho muda

  return null; // nao renderiza nada
};

export default ScrollToTop; // exporta o componente

