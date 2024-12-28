import express from 'express';
import path from 'path';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes'
import orderRoutes from './routes/orderRoutes'
import reviewRoutes from './routes/reviewRoutes';

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

app.get('*', (req, res) => {

        res.sendFile(path.join(staticPath, 'index.html'));

});




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
