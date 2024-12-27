import { orderDB } from '../dbInstances';

export interface Order 
{
    userID: string;
    wineIDs: string[];
    dateOfPurchase: Date; 
    userEmail: string;
}

export default class orderdbWorker 
{
    private db = orderDB;

    public insertOrder(order: Order)
    {
        return new Promise((resolve, reject) => 
            {
                this.db.insert(order, (err: Error | null, newOrder: Order) => 
                {
                    err ? reject(err) : resolve(newOrder);
                });
            });
    }

    public getAllOrders(): Promise<Order[]> {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err: Error | null, orders: Order[]) => {
                err ? reject(err) : resolve(orders);
            });
        });
    }

    public getOrderById(id: string): Promise<Order | null> {
        return new Promise((resolve, reject) => {
            this.db.findOne({ _id: id }, (err: Error | null, order: Order | null) => {
                err ? reject(err) : resolve(order);
            });
        });
    }

    public deleteOrder(id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.db.remove({ _id: id }, {}, (err: Error | null, numRemoved: number) => {
                err ? reject(err) : resolve(numRemoved);
            });
        });
    }

    public filterOrders(filter: Partial<Order>): Promise<Order[]> {
        return new Promise((resolve, reject) => {
            if (filter.dateOfPurchase !== undefined) {
                filter.dateOfPurchase = new Date(filter.dateOfPurchase as any);
            } 

            this.db.find(filter, (err: Error | null, orders: Order[]) => {
                err ? reject(err) : resolve(orders);
            });
        });
    }

}