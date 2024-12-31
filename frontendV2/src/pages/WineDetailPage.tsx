import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useCheckout } from "../context/CheckoutContext";
import "../css/wineDetailPage.css";

// interface para o formato do vinho
interface Wine {
  _id: string; // id do vinho
  image: string; // imagem do vinho
  name: string; // nome do vinho
  price: number; // preco do vinho
  rating: number; // avaliacao media
  region: string; // regiao de origem
  type: string; // tipo do vinho (tinto, branco, etc.)
  year: number; // ano de producao
  description: string; // descricao do vinho
  vol: number; // teor alcoolico
  capacity: number; // capacidade da garrafa
}

// interface para o formato de uma review
interface Review {
  userID: string; // id do usuario que fez a review
  wineID: string; // id do vinho avaliado
  rating: number; // nota da review
  comment: string; // comentario da review
  dateTime: string; // data e hora da review
}

const WineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // pega o id do vinho da url
  const { user } = useUser(); // pega o usuario logado do contexto
  const { addToCheckout } = useCheckout(); // funcao pra adicionar ao carrinho
  const [wine, setWine] = useState<Wine | null>(null); // estado pros detalhes do vinho
  const [reviews, setReviews] = useState<Review[]>([]); // estado pras reviews
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" }); // estado pra nova review
  const [errorMessage, setErrorMessage] = useState(""); // estado pra mensagens de erro
  const [isLoading, setIsLoading] = useState(true); // estado pra carregamento

  // busca os detalhes do vinho e as reviews
  useEffect(() => {
    if (!id) {
      setErrorMessage("id invalido ou nao encontrado."); // se o id nao e valido
      return;
    }

    const fetchWineDetails = async () => {
      setIsLoading(true); // ativa o loading
      try {
        const response = await fetch(`/api/products/${id}`); // busca detalhes do vinho
        if (!response.ok) throw new Error("erro ao buscar os detalhes do vinho.");
        const data = await response.json();
        setWine(data); // salva os detalhes do vinho
      } catch (error) {
        console.error("erro ao carregar os detalhes do vinho:", error);
        setErrorMessage("erro ao carregar os detalhes do vinho.");
      } finally {
        setIsLoading(false); // desativa o loading
      }
    };

    const fetchWineReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?wineID=${id}`); // busca as reviews
        if (!response.ok) throw new Error("erro ao buscar reviews.");
        const data = await response.json();
        setReviews(data); // salva as reviews
      } catch (error) {
        console.error("erro ao carregar reviews:", error);
        setErrorMessage("erro ao carregar as reviews.");
      }
    };

    fetchWineDetails(); // busca os detalhes do vinho
    fetchWineReviews(); // busca as reviews
  }, [id]); // roda sempre que o id mudar

  // envia uma nova review
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // previne reload da pagina

    if (!user) {
      alert("precisas de estar logado para enviar uma review.");
      return;
    }

    if (newReview.rating < 1 || newReview.rating > 5) {
      setErrorMessage("a nota deve ser entre 1 e 5.");
      return;
    }

    if (!newReview.comment.trim()) {
      setErrorMessage("o comentario nao pode estar vazio.");
      return;
    }

    const reviewData = {
      userID: user.id, // id do utilizador logado
      wineID: id, // id do vinho
      rating: newReview.rating, // nota
      comment: newReview.comment.trim(), // comentario
    };

    console.log("enviando dados da review:", reviewData); // log pra debug

    try {
      const response = await fetch("/api/reviews", {
        method: "POST", // metodo pra enviar a review
        headers: {
          "Content-Type": "application/json", // conteudo json
        },
        body: JSON.stringify(reviewData), // corpo da requisicao com os dados da review
      });

      if (response.ok) {
        const newReviewData = await response.json(); // pega a nova review
        setReviews((prev) => [...prev, newReviewData]); // adiciona a nova review
        setNewReview({ rating: 0, comment: "" }); // limpa os campos
        setErrorMessage(""); // reseta erros
      } else {
        const errorData = await response.json(); // pega o erro
        console.error("erro ao enviar review:", errorData);
        setErrorMessage(errorData.error || "erro ao enviar review.");
      }
    } catch (err) {
      console.error("erro ao enviar review:", err); // log do erro
      setErrorMessage("ocorreu um erro ao enviar a review."); // mensagem de erro
    }
  };

  // adiciona o vinho ao carrinho
  const handleAddToCart = () => {
    if (!wine) return; // se nao tem vinho, nao faz nada

    addToCheckout({
      id: wine._id, // id do vinho
      name: wine.name, // nome do vinho
      price: wine.price, // preco do vinho
      quantity: 1, // quantidade inicial
      img: wine.image, // imagem do vinho
    });
  };

  return (
    <div className="wine-detail">
      {isLoading && <p>Carregando...</p>}
      {wine && (
        <>
          <div className="wine-info">
            <img src={wine.image} alt={wine.name} />
            <h1>{wine.name}</h1>
            <p>
              <strong>Tipo:</strong> {wine.type}
            </p>
            <p>
              <strong>Região:</strong> {wine.region}
            </p>
            <p>
              <strong>Preço:</strong> €{wine.price.toFixed(2)}
            </p>
            <p>
              <strong>Ano:</strong> {wine.year}
            </p>
            <p>
              <strong>Teor Alcoólico:</strong> {wine.vol}%
            </p>
            <p>
              <strong>Capacidade:</strong> {wine.capacity}ml
            </p>
            <p>
              <strong>Descrição:</strong> {wine.description}
            </p>
            <p>
              <strong>Avaliação:</strong> {"★".repeat(Math.floor(wine.rating))}
            </p>
            <button className="add-to-cart-button" onClick={handleAddToCart}>
              Adicionar ao Carrinho
            </button>
          </div>

          <section className="reviews-section">
            <h2>Reviews</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <ul className="reviews-list">
              {reviews.map((review, index) => (
                <li key={index} className="review-item">
                  <p>
                    <strong>Nota:</strong> {review.rating} ★
                  </p>
                  <p>
                    <strong>Comentário:</strong> {review.comment}
                  </p>
                  <p>
                    <small>{review.dateTime}</small>
                  </p>
                </li>
              ))}
            </ul>
            <form onSubmit={handleReviewSubmit} className="review-form">
              <h3>Adicionar uma Review</h3>
              <div className="form-group">
                <label htmlFor="rating">Nota (1-5):</label>
                <input
                  type="number"
                  id="rating"
                  min="1"
                  max="5"
                  value={newReview.rating || ""}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      rating: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="comment">Comentário:</label>
                <textarea
                  id="comment"
                  rows={3}
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                />
              </div>
              <button type="submit">Enviar Review</button>
            </form>
          </section>
        </>
      )}
    </div>
  );
};

export default WineDetailPage;
