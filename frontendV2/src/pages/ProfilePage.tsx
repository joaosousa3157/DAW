import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import "../css/profilePage.css";

interface Order {
  _id: string;
  dateOfPurchase: string;
}

const ProfilePage: React.FC = () => {
  const { user, logout, login } = useUser(); // adiciona login ao contexto
  const [orders, setOrders] = useState<Order[]>([]); // guarda pedidos
  const [isLoading, setIsLoading] = useState(true); // flag pra loading
  const [username, setUsername] = useState(user?.username || ""); // estado para o username
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user) return; // se nao tem user, nao faz nada

    // busca os pedidos do user
    fetch(`/api/orders?userID=${user.email}`) // usa o email pra buscar
      .then((response) => response.json()) // pega resposta como json
      .then((data) => {
        setOrders(data); // salva os pedidos
        setIsLoading(false); // para o loading
      })
      .catch((error) => {
        console.error("erro ao carregar pedidos:", error); // log do erro
        setIsLoading(false); // para o loading mesmo com erro
      });
  }, [user]); // roda quando o user muda

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

  if (!user) {
    return <p>Você precisa fazer login para acessar esta página.</p>; // mensagem se nao logado
  }

  return (
    <div className="user-profile-page">
      <header className="profile-header">
        <h1>meu perfil</h1>
        <p>gerencie suas informacoes pessoais e veja o historico de pedidos.</p>
      </header>

      <section className="profile-details">
        <h2>informacoes pessoais</h2>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label htmlFor="name">nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="joao silva" // exemplo de nome
              value={username} // pega o username do estado
              onChange={(e) => setUsername(e.target.value)} // atualiza o estado
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="joao@email.com" // placeholder generico
              value={user.email} // mostra o email do user
              readOnly // nao deixa editar
            />
          </div>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="update-button">
            atualizar informacoes
          </button>
        </form>
      </section>

      <section className="order-history">
        <h2>historico de pedidos</h2>
        {isLoading ? ( // mostra loading enquanto busca
          <p>carregando pedidos...</p>
        ) : orders.length > 0 ? ( // se tem pedidos, mostra eles
          <ul>
            {orders.map((order) => (
              <li key={order._id}>
                <span>pedido #{order._id}</span> - {order.dateOfPurchase}
              </li>
            ))}
          </ul>
        ) : (
          <p>nenhum pedido encontrado.</p> // mensagem se nao tem pedidos
        )}
      </section>

      <section className="account-settings">
        <h2>configuracoes da conta</h2>
        <button onClick={logout} className="logout-button">
          sair da conta
        </button>
        <button className="delete-account-button">
          excluir conta
        </button>
      </section>
    </div>
  );
};

export default ProfilePage;
