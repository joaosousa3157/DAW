import { orderDB } from '../dbInstances';

export interface Order {
    userID: string; // id do usuario
    wineIDs: string[]; // ids dos vinhos comprados
    dateOfPurchase: Date; // data da compra
    userEmail: string; // email do usuario
}

export default class orderdbWorker {
    private db = orderDB; // referencia para o banco de dados de orders

    public insertOrder(order: Order) {
        // insere uma nova order
        return new Promise((resolve, reject) => {
            this.db.insert(order, (err: Error | null, newOrder: Order) => {
                err ? reject(err) : resolve(newOrder);
            });
        });
    }

    public getAllOrders(): Promise<Order[]> {
        // devolve todas as orders
        return new Promise((resolve, reject) => {
            this.db.find({}, (err: Error | null, orders: Order[]) => {
                err ? reject(err) : resolve(orders);
            });
        });
    }

    public getOrderById(id: string): Promise<Order | null> {
        // devolve uma order pelo id
        return new Promise((resolve, reject) => {
            this.db.findOne({ _id: id }, (err: Error | null, order: Order | null) => {
                err ? reject(err) : resolve(order);
            });
        });
    }

    public deleteOrder(id: string): Promise<number> {
        // apaga uma order pelo id
        return new Promise((resolve, reject) => {
            this.db.remove({ _id: id }, {}, (err: Error | null, numRemoved: number) => {
                err ? reject(err) : resolve(numRemoved);
            });
        });
    }

    public filterOrders(filter: Partial<Order>): Promise<Order[]> {
        // devolve orders que cumprem o filtro
        return new Promise((resolve, reject) => {
            if (filter.dateOfPurchase !== undefined) {
                filter.dateOfPurchase = new Date(filter.dateOfPurchase as any); // formata data
            }

            this.db.find(filter, (err: Error | null, orders: Order[]) => {
                err ? reject(err) : resolve(orders);
            });
        });
    }
}
