import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/wineDetailPage.css";

interface Wine {
  _id: string;
  image: string;
  name: string;
  price: number;
  rating: number;
  region: string;
  type: string;
  year: number;
  description: string;
  vol: number; // Teor alcoólico
  capacity: number; // Capacidade
}

interface Review {
  userID: string;
  wineID: string;
  rating: number;
  comment: string;
  dateTime: string;
}

const WineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Captura o ID do vinho da URL
  const [wine, setWine] = useState<Wine | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setErrorMessage("ID inválido ou não encontrado.");
      return;
    }

    // Função para buscar os detalhes do vinho
    const fetchWineDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error("Erro ao buscar os detalhes do vinho.");
        const data = await response.json();
        setWine(data);
      } catch (error) {
        console.error("Erro ao carregar os detalhes do vinho:", error);
        setErrorMessage("Erro ao carregar os detalhes do vinho.");
      } finally {
        setIsLoading(false);
      }
    };

    // Função para buscar reviews do vinho
    const fetchWineReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?wineID=${id}`);
        if (!response.ok) throw new Error("Erro ao buscar reviews.");
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Erro ao carregar reviews:", error);
        setErrorMessage("Erro ao carregar as reviews.");
      }
    };

    fetchWineDetails();
    fetchWineReviews();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReview.rating || !newReview.comment) {
      setErrorMessage("Por favor, preencha todos os campos da review.");
      return;
    }

    const reviewData = {
      wineID: id,
      ...newReview,
    };

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        const createdReview = await response.json();
        setReviews((prev) => [...prev, createdReview]);
        setNewReview({ rating: 0, comment: "" });
        setErrorMessage("");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Erro ao enviar review.");
      }
    } catch (error) {
      console.error("Erro ao enviar review:", error);
      setErrorMessage("Erro ao enviar review.");
    }
  };

  if (isLoading) return <p>Carregando...</p>;

  if (errorMessage) return <p className="error-message">{errorMessage}</p>;

  if (!wine) return <p>Vinho não encontrado.</p>;

  return (
    <div className="wine-detail">
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
      </div>

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
