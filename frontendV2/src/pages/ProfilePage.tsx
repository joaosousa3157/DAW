import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext"; // Importa o contexto do usuário
import "../css/profilePage.css";

interface Order {
  _id: string;
  dateOfPurchase: string;
}

const ProfilePage: React.FC = () => {
  const { user, logout } = useUser(); // Obtém o usuário logado e a função de logout
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // Se não houver usuário, não tenta carregar os pedidos

    // Busca os pedidos do usuário logado
    fetch(`/api/orders?userID=${user.email}`) // Filtra os pedidos pelo email do usuário
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

  if (!user) {
    return <p>Você precisa fazer login para acessar esta página.</p>;
  }

  return (
    <div className="user-profile-page">
      <header className="profile-header">
        <h1>Meu Perfil</h1>
        <p>Gerencie suas informações pessoais e veja o histórico de pedidos.</p>
      </header>

      <section className="profile-details">
        <h2>Informações Pessoais</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="João Silva"
              defaultValue={user.email.split("@")[0]} // Exemplo de nome derivado do email
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="joao.silva@email.com"
              value={user.email} // Exibe o email do usuário logado
              readOnly
            />
          </div>
          <button type="submit" className="update-button">
            Atualizar Informações
          </button>
        </form>
      </section>

      <section className="order-history">
        <h2>Histórico de Pedidos</h2>
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
        <h2>Configurações da Conta</h2>
        <button onClick={logout} className="logout-button">
          Sair da Conta
        </button>
        <button className="delete-account-button">
          Excluir Conta
        </button>
      </section>
    </div>
  );
};

export default ProfilePage;
