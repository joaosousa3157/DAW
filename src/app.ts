import express from 'express';
import wineRoutes from './routes/wineRoutes';

const app = express();
const PORT = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/wines', wineRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));//ricky não comas a massa do sandi
