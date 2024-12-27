import express, { Router } from 'express';
import userdbWorker from '../models/userModel'
import { Request, Response } from 'express';

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


router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("test");

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
    }

    try {
        const user = await userWorker.getUserByEmail(email);

        if (user && user.password === password) {
            res.status(200).json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ error: 'Invalid email or password.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An internal error occurred.' });
    }
});


export default router