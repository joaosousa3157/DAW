import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../css/wineDetailPage.css";

// interface para o formato de uma review
interface Review {
  userID: string;
  wineID: string;
  rating: number;
  comment: string;
  dateTime: string;
}

const WineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // pega o id do vinho da url
  const { user } = useUser(); // pega o usuario logado do contexto
  console.log("Usuario no contexto:", user); // debug
  const [wine, setWine] = useState<any>(null); // estado para detalhes do vinho
  const [reviews, setReviews] = useState<Review[]>([]); // estado para reviews
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  }); // estado para review nova
  const [errorMessage, setErrorMessage] = useState(""); // estado para erros

  useEffect(() => {
    // busca os detalhes do vinho
    fetch(`/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => setWine(data))
      .catch((error) =>
        console.error("Erro ao carregar os detalhes do vinho:", error)
      );

    // busca as reviews do vinho especifico
    fetch(`/api/reviews?wineID=${id}`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) =>
        console.error("Erro ao carregar as reviews do vinho:", error)
      );
  }, [id]); // executa toda vez que o id mudar

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // evita refresh da pagina

    if (!user) {
      alert("Voce precisa estar logado para enviar uma review."); // avisa caso nao esteja logado
      return;
    }

    const reviewData = {
      userID: user.id, // pega id do usuario logado
      wineID: id, // id do vinho
      rating: newReview.rating, // pega nota da nova review
      comment: newReview.comment, // pega comentario da nova review
    };

    try {
      console.log("Enviando review:", reviewData); // debug

      const response = await fetch("/api/reviews", {
        method: "POST", // metodo POST
        headers: {
          "Content-Type": "application/json", // avisa que é json
        },
        body: JSON.stringify(reviewData), // transforma dados em json
      });

      if (response.ok) {
        const newReviewData = await response.json(); // pega review criada
        setReviews((prev) => [...prev, newReviewData]); // adiciona ao estado
        alert("Review enviada com sucesso!"); // avisa sucesso
        setNewReview({ rating: 0, comment: "" }); // limpa os campos
        setErrorMessage(""); // limpa mensagem de erro
      } else {
        const errorData = await response.json(); // pega erro
        console.error("Erro ao enviar review:", errorData); // debug
        setErrorMessage(errorData.error || "Erro ao enviar review."); // exibe erro
      }
    } catch (err) {
      console.error("Erro ao enviar review:", err); // debug
      setErrorMessage("Ocorreu um erro ao enviar a review."); // exibe erro
    }
  };

  if (!wine) {
    return <p>Carregando...</p>; // mostra loading enquanto o vinho nao carrega
  }

  return (
    <div className="wine-detail">
      <img src={wine.image} alt={wine.name} />
      <h1>{wine.name}</h1>
      <p>
        <strong>Tipo:</strong> {wine.type}
      </p>
      <p>
        <strong>Regiao:</strong> {wine.region}
      </p>
      <p className="wine-price">
        <strong>Preco:</strong> €{wine.price.toFixed(2)}
      </p>
      <p>
        <strong>Ano:</strong> {wine.year}
      </p>
      <p>
        <strong>Teor Alcoolico:</strong> {wine.vol}%
      </p>
      <p>
        <strong>Capacidade:</strong> {wine.capacity}ml
      </p>
      <div className="wine-description">
        <p>
          <strong>Descricao:</strong> {wine.description}
        </p>
      </div>
      <p className="wine-rating">
        <strong>Avaliacao:</strong> {"★".repeat(Math.floor(wine.rating))}
      </p>

      <section className="reviews-section">
        <h2>Reviews</h2>
        <ul className="reviews-list">
          {reviews.map((review, index) => (
            <li key={index} className="review-item">
              <p>
                <strong>Nota:</strong> {review.rating} ★
              </p>
              <p>
                <strong>Comentario:</strong> {review.comment}
              </p>
              <p>
                <small>{review.dateTime}</small>
              </p>
            </li>
          ))}
        </ul>
        <form onSubmit={handleReviewSubmit} className="review-form">
          <h3>Adicionar uma Review</h3>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
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
            <label htmlFor="comment">Comentario:</label>
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
    </div>
  );
};

export default WineDetailPage;
