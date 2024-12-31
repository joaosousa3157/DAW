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
    const { wineID } = req.query; // pega o parametro opcional wineID da query

    try {
        let reviews; // variavel para armazenar as reviews
        if (wineID) {
            // se o wineID foi fornecido
            reviews = await reviewWorker.getReviewsByWineID(wineID as string); // busca reviews especificas para o wineID
        } else {
            // se o wineID nao foi fornecido
            reviews = await reviewWorker.getAllReviews(); // busca todas as reviews
        }
        res.status(200).json(reviews); // responde com as reviews encontradas
    } catch (error) {
        handleError(res, error); // trata erros que possam ocorrer na operacao
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

        // itera sobre os pedidos e verifica se o vinho esta nos `cartItems`
        const purchasedWine = orders.some(order =>
            order.cartItems.some((item: any) => item.id === wineID)
        );

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
        console.error("Erro ao processar review:", error);
        res.status(500).json({ error: "An unexpected error occurred while processing your review." });
    }
});


// rota para deletar review por id
router.delete('/:id', async (req, res): Promise<void> => {
    const reviewID = req.params.id; // pega o id da review dos parametros da requisicao

    try {
        // tenta deletar a review pelo id
        const deletedCount = await reviewWorker.deleteReview(reviewID);

        if (deletedCount > 0) {
            // se encontrou e deletou a review
            res.status(200).json({ message: `Review with ID ${reviewID} deleted successfully` }); 
        } else {
            // se nao encontrou a review
            res.status(404).json({ message: `Review with ID ${reviewID} not found` }); 
        }
    } catch (error) {
        handleError(res, error); // trata erros que possam ocorrer durante a operacao
    }
});

export default router;
