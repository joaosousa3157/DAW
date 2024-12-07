import express, { Router } from 'express';
import winedbWorker from '../models/wineModel'


const router : Router = express.Router();
const wineWorker: winedbWorker = new winedbWorker();

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
        const wines = await wineWorker.getAllWines();
        res.status(200).json(wines);
    } 
    catch (error) 
    {
        handleError(res, error)
    }
});

router.get('/:id', async (req, res) => {

    const wineId = Number(req.params.id);
    if (!Number.isInteger(wineId)) 
    {
        res.status(400).json({ error: "Invalid wine ID" });
    }

    try 
    {
        const wine = await wineWorker.getWineById(wineId);
        if (wine) {
            res.status(200).json(wine);
        } else {
            res.status(404).json({ message: `Wine with ID ${wineId} not found` });
        }
    } 
    catch (error) 
    {
        handleError(res, error);
    }

});

router.post('/', async (req, res) => {
    const newWine = req.body;

    if (!newWine.name || !newWine.type || !newWine.price) 
    {
        res.status(400).json({ error: "Missing required wine fields" });
    }

    try 
    {
        const createdWine = await wineWorker.insertWine(newWine);
        res.status(201).json(createdWine);
    } 
    catch (error) 
    {
        handleError(res, error);
    }
});

// router.delete('/:id', async (req, res) => {
//     const wineId = Number(req.params.id);

//     if (!Number.isInteger(wineId)) {
//         return res.status(400).json({ error: "Invalid wine ID" });
//     }

//     try {
//         const deletedCount = await wineWorker.deleteWine(wineId);

//         if (deletedCount > 0) {
//             res.status(200).json({ message: `Wine with ID ${wineId} deleted successfully` });
//         } else {
//             res.status(404).json({ message: `Wine with ID ${wineId} not found` });
//         }
//     } catch (error) {
//         handleError(res, error);
//     }
// });




export default router