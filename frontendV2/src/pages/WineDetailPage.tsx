import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Certifique-se de usar o contexto de usuário
import { useCheckout } from "../context/CheckoutContext"; // Contexto para o carrinho
import "../css/wineDetailPage.css";

// Interface para o formato do vinho
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

// Interface para o formato de uma review
interface Review {
  userID: string;
  wineID: string;
  rating: number;
  comment: string;
  dateTime: string;
}

const WineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Captura o ID do vinho da URL
  const { user } = useUser(); // Pega o usuário logado do contexto
  const { addToCheckout } = useCheckout(); // Função para adicionar ao carrinho
  const [wine, setWine] = useState<Wine | null>(null); // Estado para os detalhes do vinho
  const [reviews, setReviews] = useState<Review[]>([]); // Estado para as reviews
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" }); // Estado para review nova
  const [errorMessage, setErrorMessage] = useState(""); // Estado para erros
  const [isLoading, setIsLoading] = useState(true); // Estado para carregamento

  // Fetch dos detalhes do vinho e reviews
  useEffect(() => {
    if (!id) {
      setErrorMessage("ID inválido ou não encontrado.");
      return;
    }

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

  // Enviar nova review
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Você precisa estar logado para enviar uma review.");
      return;
    }

    if (newReview.rating < 1 || newReview.rating > 5) {
      setErrorMessage("A nota deve ser entre 1 e 5.");
      return;
    }

    if (!newReview.comment.trim()) {
      setErrorMessage("O comentário não pode estar vazio.");
      return;
    }

    const reviewData = {
      userID: user.id, // Pega o ID do usuário logado
      wineID: id, // ID do vinho
      rating: newReview.rating, // Nota
      comment: newReview.comment.trim(), // Comentário
    };

    console.log("Enviando dados da review:", reviewData); // Log para debug

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        const newReviewData = await response.json();
        setReviews((prev) => [...prev, newReviewData]); // Adiciona a nova review
        setNewReview({ rating: 0, comment: "" }); // Limpa os campos
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

  const handleAddToCart = () => {
    if (!wine) return;

    addToCheckout({
      id: wine._id,
      name: wine.name,
      price: wine.price,
      quantity: 1,
      img: wine.image,
    });
    alert(`${wine.name} foi adicionado ao carrinho.`);
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
