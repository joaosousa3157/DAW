import express from 'express';
import path from 'path';
import fs from 'fs';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import reviewRoutes from './routes/reviewRoutes';
import productsdbWorker from './models/productModel';

const app = express();  
const PORT = 3000;
const staticPath = path.join(__dirname, '/../../frontendV2/dist');

app.use(express.json()); // para tratar JSON
app.use(express.urlencoded({ extended: true })); // para tratar formulários
app.use('/api/products', productRoutes); // rotas de produtos
app.use('/api/users', userRoutes); // rotas de usuários
app.use('/api/orders', orderRoutes); // rotas de pedidos
app.use('/api/reviews', reviewRoutes); // rotas de reviews

app.use(express.static(staticPath)); // serve arquivos estáticos

const initializeProducts = async () => {
    const productWorker = new productsdbWorker();
    try {
        const products = await productWorker.getAllproducts(); // verifica se já existem produtos

        if (products.length === 0) { // se não tem produtos, carrega o wines.json
            console.log('Base de dados vazia. A inserir produtos do wines.json...');
            
            const winesData = JSON.parse(
                fs.readFileSync(path.join(__dirname, '../wines.json'), 'utf8')
            );

            for (const product of winesData) {
                await productWorker.insertProduct(product); // insere produtos no banco
            }

            console.log('Produtos inserirdos com sucesso.');
        } else {
            console.log('Base de dados de produtos já contém dados.');
        }
    } catch (error) {
        console.error('Erro ao inicializar os produtos:', error);
    }
};

app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html')); // para qualquer rota, devolve o index.html
});

initializeProducts().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // inicia o servidor
});
