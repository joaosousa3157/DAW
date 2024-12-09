import express, { Router } from 'express';
import OrderDBWorker from '../models/orderModel';

const router: Router = express.Router();
const orderWorker: OrderDBWorker = new OrderDBWorker();

const handleError = (res: express.Response, error: unknown) => {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};

router.get('/', async (req, res) => {
    try 
    {
        if (Object.keys(req.query).length === 0) 
        {
            const wines = await orderWorker.getAllOrders();
            res.status(200).json(wines);
        } 
        else 
        {
            const wines = await orderWorker.filterOrders(req.query);
            res.status(200).json(wines);
        }

    } 
    catch (error) 
    {
        handleError(res, error)
    }
});

router.post('/', async (req, res) => {
    
    const newOrder = req.body;

    try 
    {
        const createdOrder = await orderWorker.insertOrder(newOrder);
        res.status(201).json(createdOrder);
    } 
    catch (error) 
    {
        handleError(res, error);
    }
});