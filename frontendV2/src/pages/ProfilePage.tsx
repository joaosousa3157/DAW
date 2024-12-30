import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom"; // Para redirecionar
import "../css/profilePage.css";

interface Order {
  _id: string;
  dateOfPurchase: string;
}

const ProfilePage: React.FC = () => {
  const { user, logout, login } = useUser(); // Adiciona login ao contexto
  const navigate = useNavigate(); // Para redirecionar
  const [orders, setOrders] = useState<Order[]>([]); // Guarda pedidos
  const [isLoading, setIsLoading] = useState(true); // Flag pra loading
  const [username, setUsername] = useState(user?.username || ""); // Estado para o username
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Redireciona para login se o usuário não estiver logado
  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redireciona para a página de login
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return; // Se não tem user, não faz nada

    // Busca os pedidos do user
    fetch(`/api/orders?userID=${user.email}`) // Usa o email pra buscar
      .then((response) => response.json()) // Pega resposta como JSON
      .then((data) => {
        setOrders(data); // Salva os pedidos
        setIsLoading(false); // Para o loading
      })
      .catch((error) => {
        console.error("Erro ao carregar pedidos:", error); // Log do erro
        setIsLoading(false); // Para o loading mesmo com erro
      });
  }, [user]); // Roda quando o user muda

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
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        const updatedUser = await response.json(); // Usuário atualizado do backend
        console.log("Usuário atualizado do backend:", updatedUser); // Log do backend
        setSuccessMessage("Nome de usuário atualizado com sucesso!");
        setErrorMessage("");

        // Atualiza todo o contexto com os dados recebidos
        login({
          id: updatedUser._id,
          email: updatedUser.email,
          username: updatedUser.username,
        });
        console.log("Contexto atualizado:", {
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

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Conta excluída com sucesso.");
        logout(); // Desloga o usuário
        navigate("/"); // Redireciona para a página inicial
      } else {
        alert("Erro ao excluir conta.");
      }
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
    }
  };

  if (!user) {
    return null; // Evita exibir conteúdo antes do redirecionamento
  }

  return (
    <div className="user-profile-page">
      <header className="profile-header">
        <h1>meu perfil</h1>
        <p>gerencie suas informações pessoais e veja o histórico de pedidos.</p>
      </header>

      <section className="profile-details">
        <h2>informações pessoais</h2>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label htmlFor="name">nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="joao silva" // Exemplo de nome
              value={username} // Pega o username do estado
              onChange={(e) => setUsername(e.target.value)} // Atualiza o estado
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="joao@email.com" // Placeholder generico
              value={user.email} // Mostra o email do user
              readOnly // Não deixa editar
            />
          </div>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="update-button">
            atualizar informações
          </button>
        </form>
      </section>

      <section className="order-history">
        <h2>histórico de pedidos</h2>
        {isLoading ? (
          <p>carregando pedidos...</p>
        ) : orders.length > 0 ? (
          <ul>
            {orders.map((order) => (
              <li key={order._id}>
                <span>pedido #{order._id}</span> - {order.dateOfPurchase}
              </li>
            ))}
          </ul>
        ) : (
          <p>nenhum pedido encontrado.</p>
        )}
      </section>

      <section className="account-settings">
        <h2>configurações da conta</h2>
        <button onClick={logout} className="logout-button">
          sair da conta
        </button>
        <button onClick={handleDeleteAccount} className="delete-account-button">
          excluir conta
        </button>
      </section>
    </div>
  );
};

export default ProfilePage;
