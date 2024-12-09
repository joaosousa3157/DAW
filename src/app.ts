import express from 'express';
import wineRoutes from './routes/wineRoutes';
import userRoutes from './routes/userRoutes'
import orderRoutes from './routes/orderRoutes'

const app = express();  
const PORT = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/wines', wineRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
