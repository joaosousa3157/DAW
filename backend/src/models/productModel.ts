import { productDB } from '../dbInstances';

// interface do produto com todas as propriedades do vinho
export interface Product 
{
    id: number, // id unico do produto
    name: string, // nome do produto
    type: string, // tipo do produto (tinto, branco, verde)
    region : string, // regiao do vinho
    price: number, // preco do vinho
    year: number, // ano de producao
    description: string, // descricao detalhada do vinho
    vol: number, // teor alcoolico
    capacity: number, // capacidade da garrafa
    image: string, // link da imagem
    category: string; // categoria do produto
    rating: number, // avaliacao do vinho
}

// classe para interagir com a base de dados de produtos
export default class productsdbWorker 
{
    private db = productDB; // referencia ao banco de dados

    public insertProduct(product: Product): Promise<Product> {
        // insere um novo produto na base de dados
        return new Promise((resolve, reject) => {
            this.db.insert(product, (err: Error | null, newProduct: Product) => {
                if (err) reject(err); // rejeita se ocorrer erro
                else resolve(newProduct); // resolve com o produto inserido
            });
        });
    }

    public getAllproducts() : Promise<Product[]> 
    {
        // devolve todos os produtos da base de dados
        return new Promise((resolve, reject) =>{

            this.db.find({}, (err: Error | null, wines: Product[]) =>{

                err ? reject(err) : resolve(wines); // rejeita se erro, resolve se sucesso

            });
        });

    }

    public async getProductById(id: string): Promise<Product | null> {
        return new Promise((resolve, reject) => {
            this.db.findOne({ _id: id }, (err: Error | null, product: Product | null) => {
                if (err) {
                    console.error("Erro ao buscar produto:", err); // Log de erro
                    reject(err);
                } else {
                    resolve(product);
                }
            });
        });
    }

    public updateProduct(id: number, updatedProduct: Product): Promise<number>
    {
        // atualiza um produto especifico pelo id
        return new Promise((resolve, reject) =>{

            this.db.update({id:id}, updatedProduct, {}, (err: Error | null, idUpdated: number)=>{

                err ? reject(err): resolve(idUpdated); // rejeita se erro, resolve com id atualizado

            });
        });
    }

    public deleteProduct(id: number): Promise<number> 
    {
        // remove um produto especifico pelo id
        return new Promise((resolve, reject) =>{

            this.db.remove({id:id}, (err: Error | null, idRemoved: number) =>{
                
                err ? reject(err) : resolve(idRemoved); // rejeita se erro, resolve com id removido
            });
        });
    }

    public filterProducts(filter: Partial<Product>): Promise<Product[]> 
    {
        // filtra produtos com base nos criterios passados
        return new Promise((resolve, reject) => 
        {
            // formata valores numericos antes de filtrar
            if (filter.id !== undefined) filter.id = parseInt(filter.id as any);
            if (filter.price !== undefined) filter.price = parseFloat(filter.price as any);
            if (filter.vol !== undefined) filter.vol = parseFloat(filter.vol as any);
            if (filter.capacity !== undefined) filter.capacity = parseInt(filter.capacity as any);
            
            this.db.find(filter, (err: Error | null, wines: Product[]) => {

                err ? reject(err) : resolve(wines); // rejeita se erro, resolve com os resultados
            });
        });
    }
}
