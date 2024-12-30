import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import "../css/profilePage.css";

interface Order {
  _id: string;
  dateOfPurchase: string;
}

const ProfilePage: React.FC = () => {
  const { user, logout } = useUser(); // pega o user logado e a funcao de logout
  const [orders, setOrders] = useState<Order[]>([]); // guarda pedidos
  const [isLoading, setIsLoading] = useState(true); // flag pra loading

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

  if (!user) {
    return <p>voce precisa fazer login pra acessar esta pagina.</p>; // mensagem se nao logado
  }

  return (
    <div className="user-profile-page">
      <header className="profile-header">
        <h1>meu perfil</h1>
        <p>gerencie suas informacoes pessoais e veja o historico de pedidos.</p>
      </header>

      <section className="profile-details">
        <h2>informacoes pessoais</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="joao silva" // exemplo de nome
              defaultValue={user.email.split("@")[0]} // gera nome do email
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
