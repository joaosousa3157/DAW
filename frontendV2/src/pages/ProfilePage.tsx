import React, { useEffect, useState } from "react";
import "../css/profilePage.css";

interface Order {
  _id: string;
  dateOfPurchase: string;
}

const ProfilePage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Simulating fetching data from a JSON file
    fetch("/api/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Erro ao carregar pedidos:", error));
  }, []);

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
            <input type="text" id="name" name="name" placeholder="João Silva" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="joao.silva@email.com" />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefone:</label>
            <input type="tel" id="phone" name="phone" placeholder="+55 11 91234-5678" />
          </div>
          <button type="submit" className="update-button">Atualizar Informações</button>
        </form>
      </section>

      <section className="order-history">
        <h2>Histórico de Pedidos</h2>
        {orders.length > 0 ? (
          <ul>
            {orders.map((order) => (
              <li key={order._id}>
                <span>Pedido #{order._id}</span> - {order.dateOfPurchase} - <strong>0</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>Carregando pedidos...</p>
        )}
      </section>

      <section className="account-settings">
        <h2>Configurações da Conta</h2>
        <button className="logout-button">Sair da Conta</button>
        <button className="delete-account-button">Excluir Conta</button>
      </section>
    </div>
  );
};

export default ProfilePage;
