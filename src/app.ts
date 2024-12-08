import express from 'express';
import wineRoutes from './routes/wineRoutes';
import userRoutes from './routes/userRoutes'

const app = express();  
const PORT = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/wines', wineRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
