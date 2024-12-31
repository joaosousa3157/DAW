import { orderDB } from '../dbInstances';

// interface pra itens no carrinho
export interface CartItem {
    id: string; // id do vinho
    name: string; // nome do vinho
    price: number; // preco
    quantity: number; // quantidade
    img?: string; // imagem (opcional)
}

// interface pra pedidos
export interface Order {
    userID: string; // id do usuario
    firstName: string; // nome proprio
    lastName: string; // sobrenome
    nif: string; // nif
    shippingAddress: string; // endereco de entrega
    shippingPhone: string; // telefone de entrega
    billingAddress: string; // endereco de cobranca
    paymentMethod: string; // metodo de pagamento
    cartItems: CartItem[]; // itens no carrinho
    dateOfPurchase: Date; // data da compra
    userEmail: string; // email do usuario
    _id?: string,
    total: number,
}

// classe pra mexer no banco de pedidos
export default class orderdbWorker {
    private db = orderDB; // referencia ao banco de dados de pedidos

    // insere uma nova ordem
    public insertOrder(order: Order): Promise<Order> {
        return new Promise((resolve, reject) => {
            this.db.insert(order, (err: Error | null, newOrder: Order) => {
                if (err) {
                    reject(err); // erro ao inserir
                } else {
                    resolve(newOrder); // deu certo
                }
            });
        });
    }

    // pega todas as ordens
    public getAllOrders(): Promise<Order[]> {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err: Error | null, orders: Order[]) => {
                if (err) {
                    reject(err); // erro ao buscar
                } else {
                    resolve(orders); // deu certo
                }
            });
        });
    }

    // pega uma ordem pelo id
    public getOrderById(id: string): Promise<Order | null> {
        return new Promise((resolve, reject) => {
            this.db.findOne({ _id: id }, (err: Error | null, order: Order | null) => {
                if (err) {
                    reject(err); // erro ao buscar pelo id
                } else {
                    resolve(order); // achou a ordem
                }
            });
        });
    }

    // apaga uma ordem pelo id
    public deleteOrder(id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.db.remove({ _id: id }, {}, (err: Error | null, numRemoved: number) => {
                if (err) {
                    reject(err); // erro ao apagar
                } else {
                    resolve(numRemoved); // numero de ordens apagadas
                }
            });
        });
    }

    // filtra ordens com base no criterio dado
    public filterOrders(filter: Partial<Order>): Promise<Order[]> {
        return new Promise((resolve, reject) => {
            if (filter.dateOfPurchase !== undefined) {
                filter.dateOfPurchase = new Date(filter.dateOfPurchase as any); // ajeita a data
            }

            this.db.find(filter, (err: Error | null, orders: Order[]) => {
                if (err) {
                    reject(err); // erro ao filtrar
                } else {
                    resolve(orders); // ordens filtradas
                }
            });
        });
    }
}
