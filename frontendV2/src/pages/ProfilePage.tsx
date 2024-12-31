import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "../css/profilePage.css";

// interface para os pedidos
interface Order {
  _id: string; // id do pedido
  dateOfPurchase: string; // data da compra
  total: number; // total da compra
}

// componente para a pagina de perfil
const ProfilePage: React.FC = () => {
  const { user, logout, login } = useUser(); // obtem informacoes do usuario e metodos do contexto
  const navigate = useNavigate(); // usado para redirecionar
  const [orders, setOrders] = useState<Order[]>([]); // estado para armazenar pedidos
  const [isLoading, setIsLoading] = useState(true); // flag para indicar se os pedidos estao a carregar
  const [username, setUsername] = useState(user?.username || ""); // estado para o nome do usuario
  const [email, setEmail] = useState(user?.email || ""); // estado para o email do usuario
  const [successMessage, setSuccessMessage] = useState(""); // mensagem de sucesso
  const [errorMessage, setErrorMessage] = useState(""); // mensagem de erro

  // verifica se o usuario esta logado, se nao redireciona para login
  useEffect(() => {
    if (!user) {
      navigate("/login"); // manda o usuario para a pagina de login
    }
  }, [user, navigate]); // roda sempre que o user ou navigate mudam

  // carrega os pedidos do usuario
  useEffect(() => {
    if (!user) return; // se nao tem usuario, nao faz nada

    fetch(`/api/orders?userID=${user.id}`) // busca os pedidos do usuario pelo id
      .then((response) => response.json()) // converte a resposta para json
      .then((data) => {
        setOrders(data); // guarda os pedidos no estado
        setIsLoading(false); // para o loading
      })
      .catch((error) => {
        console.error("Erro ao carregar pedidos:", error); // log do erro
        setIsLoading(false); // para o loading mesmo com erro
      });
  }, [user]); // roda sempre que o usuario mudar

  // atualiza as informacoes do usuario
  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault(); // evita o reload da pagina

    if (!user) {
      setErrorMessage("Precisas de estar logado para atualizar informacoes.");
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT", // faz um update
        headers: { "Content-Type": "application/json" }, // diz que o conteudo e json
        body: JSON.stringify({ username, email }), // manda o nome e o email
      });

      if (response.ok) {
        const updatedUser = await response.json(); // pega o usuario atualizado
        setSuccessMessage("Informacoes atualizadas com sucesso!");
        setErrorMessage("");

        // atualiza o contexto do usuario com os novos dados
        login({
          id: updatedUser._id,
          email: updatedUser.email,
          username: updatedUser.username,
        });
      } else {
        const errorData = await response.json(); // pega o erro retornado
        setErrorMessage(errorData.error || "Erro ao atualizar informacoes.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Erro ao atualizar informacoes:", error); // log do erro
      setErrorMessage("Ocorreu um erro. Tenta novamente."); // mensagem de erro
      setSuccessMessage("");
    }
  };

  // apaga a conta do usuario
  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE", // deleta a conta
      });

      if (response.ok) {
        alert("Conta apagada com sucesso."); // mensagem de sucesso
        logout(); // desloga o usuario
        navigate("/"); // redireciona para a pagina inicial
      } else {
        alert("Erro ao apagar conta."); // mensagem de erro
      }
    } catch (error) {
      console.error("Erro ao apagar conta:", error); // log do erro
    }
  };

  if (!user) {
    return null; // nao mostra nada se nao tiver usuario
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
                <span>Pedido #{order._id}</span>
                <span>{order.dateOfPurchase}</span>
                <span>{order.total} €</span>
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
