import { productDB } from '../dbInstances';


export interface Product 
{
    id: number,
    name: string,
    type: string,
    region : string,
    price: number,
    year: number,
    description: string,
    vol: number,
    capacity: number,
    image: string,
    category: string;
    rating: number,
}

export default class productsdbWorker 
{
    private db = productDB;

    public insertProduct(product: Product): Promise<Product> {
        return new Promise((resolve, reject) => {
            this.db.insert(product, (err: Error | null, newProduct: Product) => {
                if (err) reject(err);
                else resolve(newProduct);
            });
        });
    }

    public getAllproducts() : Promise<Product[]> 
    {
        return new Promise((resolve, reject) =>{

            this.db.find({}, (err: Error | null, wines: Product[]) =>{

                err ? reject(err) : resolve(wines);

            });
        });

    }

    public getProductById(id: number): Promise<Product | null>
    {
        return new Promise((resolve, reject) =>{

            this.db.findOne({ id: id }, (err: Error | null, product: Product | null) => {

                err ? reject(err) : resolve(product);

            });
        });
    }

    public updateProduct(id: number, updatedProduct: Product): Promise<number>
    {
        return new Promise((resolve, reject) =>{

            this.db.update({id:id}, updatedProduct, {}, (err: Error | null, idUpdated: number)=>{

                err ? reject(err): resolve(idUpdated)

            });
        });
    }

    public deleteProduct(id: number): Promise<number> 
    {
        return new Promise((resolve, reject) =>{

            this.db.remove({id:id}, (err: Error | null, idRemoved: number) =>{
                
                err ? reject(err) : resolve(idRemoved);
            });
        });
    }

    public filterProducts(filter: Partial<Product>): Promise<Product[]> 
    {
        return new Promise((resolve, reject) => 
        {
            if (filter.id !== undefined) filter.id = parseInt(filter.id as any);
            if (filter.price !== undefined) filter.price = parseFloat(filter.price as any);
            if (filter.vol !== undefined) filter.vol = parseFloat(filter.vol as any);
            if (filter.capacity !== undefined) filter.capacity = parseInt(filter.capacity as any);
            
            this.db.find(filter, (err: Error | null, wines: Product[]) => {

                err ? reject(err) : resolve(wines);
            });
        });
    }


}