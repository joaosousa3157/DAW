import express, { Router } from 'express';
import { Review, default as ReviewdbWorker } from '../models/reviewModel';
import { Order, default as OrderdbWorker } from '../models/orderModel';
import { reviewDB, orderDB } from '../dbInstances';

const router: Router = express.Router();
const reviewWorker: ReviewdbWorker = new ReviewdbWorker(reviewDB);
const orderWorker: OrderdbWorker = new OrderdbWorker();

// funcao para lidar com erros
const handleError = (res: express.Response, error: unknown): void => {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};

// rota para obter todas as reviews
router.get('/', async (req, res): Promise<void> => {
    try {
        const reviews = await reviewWorker.getAllReviews(); // busca todas as reviews
        res.status(200).json(reviews); // envia as reviews
    } catch (error) {
        handleError(res, error);
    }
});

// rota para adicionar uma review
router.post('/', async (req, res): Promise<void> => {
    console.log("Review data received:", req.body);
    const { userID, wineID, rating, comment } = req.body;

    // valida os dados enviados
    if (!userID || !wineID || rating === undefined || rating < 1 || rating > 5) {
        res.status(400).json({ error: 'Invalid review data. Ensure userID, wineID, and a valid rating (1-5) are provided.' });
        return;
    }

    try {
        // verifica se o usuario comprou o vinho
        const orders = await orderWorker.filterOrders({ userID });
        console.log("Pedidos encontrados para o usuário:", orders);

        const purchasedWine = orders.some(order => Array.isArray(order.wineIDs) && order.wineIDs.includes(wineID));
        // verifica se vinho esta nos pedidos
        console.log(`O vinho ${wineID} foi comprado?`, purchasedWine);

        if (!purchasedWine) {
            res.status(403).json({ error: 'User must purchase the wine before reviewing it.' }); // bloqueia se nao comprou
            return;
        }

        const now = new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' }); // data atual

        // insere a nova review
        const newReview = await reviewWorker.insertReview({ userID, wineID, rating, comment, dateTime: now });
        res.status(201).json(newReview); // responde com a nova review
    } catch (error) {
        handleError(res, error);
    }
});

// rota para deletar review por id
router.delete('/:id', async (req, res): Promise<void> => {
    const reviewID = req.params.id;

    try {
        const deletedCount = await reviewWorker.deleteReview(reviewID); // tenta deletar a review

        if (deletedCount > 0) {
            res.status(200).json({ message: `Review with ID ${reviewID} deleted successfully` }); // se encontrou
        } else {
            res.status(404).json({ message: `Review with ID ${reviewID} not found` }); // se nao encontrou
        }
    } catch (error) {
        handleError(res, error);
    }
});

export default router;
