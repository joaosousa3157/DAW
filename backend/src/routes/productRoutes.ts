import express, { Router } from 'express';
import productsdbWorker from '../models/productModel'


const router : Router = express.Router();
const productsWorker: productsdbWorker = new productsdbWorker();

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
            const wines = await productsWorker.getAllproducts();
            res.status(200).json(wines);
        } 
        else 
        {
            const wines = await productsWorker.filterProducts(req.query);
            res.status(200).json(wines);
        }

    } 
    catch (error) 
    {
        handleError(res, error)
    }
});

router.post('/', async (req, res) => {
    const newWine = req.body;

    if (!newWine.name || !newWine.type || !newWine.price) 
    {
        res.status(400).json({ error: `Missing required wine fields on wine ${newWine.id}` });
    }

    try 
    {
        const createdWine = await productsWorker.insertProduct(newWine);
        res.status(201).json(createdWine);
    } 
    catch (error) 
    {
        handleError(res, error);
    }
});

router.delete('/:id', async (req, res) => {
    const wineId = Number(req.params.id);

    try {
        const deletedCount = await productsWorker.deleteProduct(wineId);

        if (deletedCount > 0) {
            res.status(200).json({ message: `Wine with ID ${wineId} deleted successfully` });
        } else {
            res.status(404).json({ message: `Wine with ID ${wineId} not found` });
        }
    } catch (error) {
        handleError(res, error);
    }
});




export default router