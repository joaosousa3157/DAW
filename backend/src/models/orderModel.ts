import { orderDB } from '../dbInstances';

// Interface para itens no carrinho
export interface CartItem {
    id: string; // ID do vinho
    name: string; // Nome do vinho
    price: number; // Preço
    quantity: number; // Quantidade
    img?: string; // Imagem (opcional)
}

// Interface para pedidos
export interface Order {
    userID: string; // ID do usuário
    firstName: string; // Nome próprio
    lastName: string; // Sobrenome
    nif: string; // NIF
    shippingAddress: string; // Endereço de entrega
    shippingPhone: string; // Telefone de entrega
    billingAddress: string; // Endereço de cobrança
    cardName: string; // Nome no cartão
    cardNumber: string; // Número do cartão
    expiryDate: string; // Data de validade do cartão
    cvv: string; // CVV do cartão
    paymentMethod: string; // Método de pagamento
    discountCode?: string; // Código de desconto (opcional)
    cartItems: CartItem[]; // Itens no carrinho
    dateOfPurchase: Date; // Data da compra
    userEmail: string; // E-mail do usuário
    _id?: string; // ID do pedido (opcional, gerado pelo banco)
}

export default class orderdbWorker {
    private db = orderDB; // Referência ao banco de dados de pedidos

    public insertOrder(order: Order): Promise<Order> {
        // Insere uma nova ordem no banco de dados
        return new Promise((resolve, reject) => {
            this.db.insert(order, (err: Error | null, newOrder: Order) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(newOrder);
                }
            });
        });
    }

    public getAllOrders(): Promise<Order[]> {
        // Retorna todas as ordens
        return new Promise((resolve, reject) => {
            this.db.find({}, (err: Error | null, orders: Order[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(orders);
                }
            });
        });
    }

    public getOrderById(id: string): Promise<Order | null> {
        // Retorna uma ordem pelo ID
        return new Promise((resolve, reject) => {
            this.db.findOne({ _id: id }, (err: Error | null, order: Order | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(order);
                }
            });
        });
    }

    public deleteOrder(id: string): Promise<number> {
        // Deleta uma ordem pelo ID
        return new Promise((resolve, reject) => {
            this.db.remove({ _id: id }, {}, (err: Error | null, numRemoved: number) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(numRemoved);
                }
            });
        });
    }

    public filterOrders(filter: Partial<Order>): Promise<Order[]> {
        // Retorna ordens que correspondem ao filtro
        return new Promise((resolve, reject) => {
            if (filter.dateOfPurchase !== undefined) {
                filter.dateOfPurchase = new Date(filter.dateOfPurchase as any); // Formata data
            }

            this.db.find(filter, (err: Error | null, orders: Order[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(orders);
                }
            });
        });
    }
}
