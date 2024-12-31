import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "../css/profilePage.css";

interface Order {
  _id: string;
  dateOfPurchase: string;
}

const ProfilePage: React.FC = () => {
  const { user, logout, login } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Redireciona para login se o usuário não estiver logado
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Carrega os pedidos do usuário
  useEffect(() => {
    if (!user) return;

    fetch(`/api/orders?userID=${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar pedidos:", error);
        setIsLoading(false);
      });
  }, [user]);

  // Atualiza as informações do usuário
  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      setErrorMessage("Você precisa estar logado para atualizar as informações.");
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setSuccessMessage("Informações atualizadas com sucesso!");
        setErrorMessage("");

        // Atualiza o contexto do usuário
        login({
          id: updatedUser._id,
          email: updatedUser.email,
          username: updatedUser.username,
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Erro ao atualizar informações.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Erro ao atualizar informações:", error);
      setErrorMessage("Ocorreu um erro. Tente novamente.");
      setSuccessMessage("");
    }
  };

  // Exclui a conta do usuário
  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Conta excluída com sucesso.");
        logout();
        navigate("/");
      } else {
        alert("Erro ao excluir conta.");
      }
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="user-profile-page">
      <header className="profile-header">
        <h1>O Meu perfil</h1>
        <p>Gerir as suas informações pessoais e ver o histórico de encomendas.</p>
      </header>

      <section className="profile-details">
        <h2>Informações pessoais</h2>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="joao silva"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="joao@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="update-button">
            Atualizar informações
          </button>
        </form>
      </section>

      <section className="order-history">
        <h2>Histórico de pedidos</h2>
        {isLoading ? (
          <p>Carregando pedidos...</p>
        ) : orders.length > 0 ? (
          <ul>
            {orders.map((order) => (
              <li key={order._id}>
                <span>Pedido #{order._id}</span> - {order.dateOfPurchase}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum pedido encontrado.</p>
        )}
      </section>

      <section className="account-settings">
        <h2>Configurações da conta</h2>
        <button onClick={logout} className="logout-button">
          Sair da conta
        </button>
        <button onClick={handleDeleteAccount} className="delete-account-button">
          Excluir conta
        </button>
      </section>
    </div>
  );
};

export default ProfilePage;
