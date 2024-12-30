import express, { Router } from 'express';
import userdbWorker from '../models/userModel'
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

const router : Router = express.Router();
const userWorker: userdbWorker = new userdbWorker();

const handleError = (res: express.Response, error: unknown) => {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com', // Pode ser Gmail ou outro serviço SMTP
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: '', // Insira o e-mail de envio
      pass: '', // Insira a senha do e-mail
    },
  });
  
  // Função para enviar o e-mail
  const sendWelcomeEmail = async (email: string, username: string) => {
    try {
      const mailOptions = {
        from: '', // O e-mail que será usado para enviar
        to: email,
        subject: 'Bem-vindo ao Otis Wines!',
        text: `Olá ${username},\n\nObrigado por se registrar no Otis Wines! Estamos felizes em tê-lo conosco.\n\nExplore nossas opções de vinhos e aproveite!\n\nAtenciosamente,\nEquipe Otis Wines`,
      };
  
      await transporter.sendMail(mailOptions);
      console.log('E-mail enviado com sucesso para:', email);
    } catch (error) {
      console.error('Erro ao enviar o e-mail:', error);
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
    const { email, username, password } = req.body; // Incluímos o username

    if (!email || !username || !password) {
        res.status(400).json({ error: 'Email, username e senha são obrigatórios.' });
        return;
    }

    try {
        const createdUser = await userWorker.insertUser({ email, username, password }); // Passa o username
        sendWelcomeEmail(email, username);
        res.status(201).json({ user : createdUser});
    } catch (error) {
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

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
    }

    try {
        const user = await userWorker.getUserByEmail(email);

        if (password === "__check_only__") {
            if (user) {
                res.status(200).json({ exists: true });
            } else {
                res.status(404).json({ exists: false });
            }
            return;
        }

        if (user && user.password === password) {
            res.status(200).json({ message: 'Login successful', user });
            console.log("Dados recebidos no login:", req.body);

        } else {
            res.status(401).json({ error: 'Invalid email or password.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An internal error occurred.' });
    }
});



export default router