import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../css/wineDetailPage.css";

interface Review {
  userID: string;
  wineID: string;
  rating: number;
  comment: string;
  dateTime: string;
}

const WineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Captura o ID do vinho da URL
  const { user } = useUser(); // Obtém o usuário logado do contexto
  console.log("Usuário no contexto:", user);
  const [wine, setWine] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Buscar os detalhes do vinho
    fetch(`/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => setWine(data))
      .catch((error) =>
        console.error("Erro ao carregar os detalhes do vinho:", error)
      );

    // Buscar as reviews do vinho específico
    fetch(`/api/reviews?wineID=${id}`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) =>
        console.error("Erro ao carregar as reviews do vinho:", error)
      );
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!user) {
      alert("Você precisa estar logado para enviar uma review.");
      return;
    }
  
    const reviewData = {
      userID: user.id, // Certifique-se de que `user.id` está correto
      wineID: id, // ID do vinho capturado na URL
      rating: newReview.rating,
      comment: newReview.comment,
    };
  
    try {
      console.log("Enviando review:", reviewData); // Log para debug
  
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });
  
      if (response.ok) {
        const newReviewData = await response.json();
        setReviews((prev) => [...prev, newReviewData]);
        alert("Review enviada com sucesso!");
        setNewReview({ rating: 0, comment: "" });
        setErrorMessage("");
      } else {
        const errorData = await response.json();
        console.error("Erro ao enviar review:", errorData);
        setErrorMessage(errorData.error || "Erro ao enviar review.");
      }
    } catch (err) {
      console.error("Erro ao enviar review:", err);
      setErrorMessage("Ocorreu um erro ao enviar a review.");
    }
  };
  
  
  

  if (!wine) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="wine-detail">
      <img src={wine.image} alt={wine.name} />
      <h1>{wine.name}</h1>
      <p>
        <strong>Tipo:</strong> {wine.type}
      </p>
      <p>
        <strong>Região:</strong> {wine.region}
      </p>
      <p className="wine-price">
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
      <div className="wine-description">
        <p>
          <strong>Descrição:</strong> {wine.description}
        </p>
      </div>
      <p className="wine-rating">
        <strong>Avaliação:</strong> {"★".repeat(Math.floor(wine.rating))}
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
    </div>
  );
};

export default WineDetailPage;
