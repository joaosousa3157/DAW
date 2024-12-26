import express, { Router } from 'express';
import userdbWorker from '../models/userModel'

const router : Router = express.Router();
const userWorker: userdbWorker = new userdbWorker();

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
        const wines = await userWorker.getAllUsers();
        res.status(200).json(wines);
    } 
    catch (error) 
    {
        handleError(res, error)
    }
});

router.post('/', async (req, res) => {
    const newUser = req.body;
    try 
    {
        const createdUser = await userWorker.insertUser(newUser);
        res.status(201).json(createdUser);
    } 
    catch (error) 
    {
        handleError(res, error);
    }
});

router.delete('/:id', async (req, res) => {
    const userID = req.params.id;

    try {
        const deletedCount = await userWorker.deleteUser(userID);

        if (deletedCount > 0) {
            res.status(200).json({ message: `Wine with ID ${userID} deleted successfully` });
        } else {
            res.status(404).json({ message: `Wine with ID ${userID} not found` });
        }
    } catch (error) {
        handleError(res, error);
    }
});

export default router