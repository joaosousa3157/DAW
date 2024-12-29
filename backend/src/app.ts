import express from 'express';
import path from 'path';
import fs from 'fs';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes'
import orderRoutes from './routes/orderRoutes'
import reviewRoutes from './routes/reviewRoutes';
import productsdbWorker from './models/productModel';

const app = express();  
const PORT = 3000
const staticPath = path.join(__dirname, '/../../frontendV2/dist');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

app.use(express.static(staticPath));

const initializeProducts = async () => {
        const productWorker = new productsdbWorker();
        try {
          const products = await productWorker.getAllproducts();
      
          if (products.length === 0) {
            console.log('Banco de dados vazio. Carregando produtos do wines.json...');
      
            const winesData = JSON.parse(
              fs.readFileSync(path.join(__dirname, '../wines.json'), 'utf8')
            );
      
            for (const product of winesData) {
              await productWorker.insertProduct(product);
            }
      
            console.log('Produtos carregados com sucesso.');
          } else {
            console.log('Banco de dados de produtos já contém dados.');
          }
        } catch (error) {
          console.error('Erro ao inicializar os produtos:', error);
        }
      };

app.get('*', (req, res) => {

        res.sendFile(path.join(staticPath, 'index.html'));

});



initializeProducts().then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
      });