import express, { Router } from 'express';
import userdbWorker from '../models/userModel';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();
const mailUser = process.env.MAILUSER;
const mailPASS = process.env.MAILPASS

const router: Router = express.Router();
const userWorker: userdbWorker = new userdbWorker();

// lida com erros no servidor
const handleError = (res: express.Response, error: unknown) => {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(500).json({ error: "Um erro desconhecido ocorreu" });
    }
};

// configuracao do transporte do nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com', // servidor SMTP
    port: 587,
    secure: false, // usa TLS
    auth: {
        user: mailUser, // email de envio
        pass: mailPASS, // senha do email
    },
});

// envia um email de boas-vindas
const sendWelcomeEmail = async (email: string, username: string) => {
    try {
        const mailOptions = {
            from: mailUser, // email que envia
            to: email, // destinatario
            subject: 'Bem-vindo ao Otis Wines!',
            text: `Olá ${username},\n\nObrigado por se registrar no Otis Wines! Estamos felizes em tê-lo conosco.\n\nExplore nossas opções de vinhos e aproveite!\n\nAtenciosamente,\nEquipe Otis Wines`,
        };

        await transporter.sendMail(mailOptions); // envia o email
        console.log('E-mail enviado com sucesso para:', email);
    } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
    }
};

// rota para listar todos os usuarios
router.get('/', async (req, res) => {
    try {
        const wines = await userWorker.getAllUsers();
        res.status(200).json(wines);
    } catch (error) {
        handleError(res, error);
    }
});

// rota para criar um usuario
router.post('/', async (req, res) => {
    const { email, username, password } = req.body;

    // valida os campos obrigatorios
    if (!email || !username || !password) {
        res.status(400).json({ error: 'Email, username e senha são obrigatórios.' });
        return;
    }

    try {
        const createdUser = await userWorker.insertUser({ email, username, password }); // insere o usuario
        sendWelcomeEmail(email, username); // envia email de boas-vindas
        res.status(201).json({ user: createdUser });
    } catch (error) {
        handleError(res, error);
    }
});

// rota para deletar um usuario por id
router.delete('/:id', async (req, res) => {
    const userID = req.params.id;

    try {
        const deletedCount = await userWorker.deleteUser(userID);

        if (deletedCount > 0) {
            res.status(200).json({ message: `User com ID ${userID} apagado com sucesso` });
        } else {
            res.status(404).json({ message: `User com ID ${userID} não encontrado` });
        }
    } catch (error) {
        handleError(res, error);
    }
});

// rota para login
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // valida os campos obrigatorios
    if (!email || !password) {
        res.status(400).json({ error: 'Email e password obrigatórios.' });
        return;
    }

    try {
        const user = await userWorker.getUserByEmail(email);

        // verifica se apenas existe o usuario
        if (password === "__check_only__") {
            if (user) {
                res.status(200).json({ exists: true });
            } else {
                res.status(404).json({ exists: false });
            }
            return;
        }

        // verifica as credenciais
        if (user && user.password === password) {
            res.status(200).json({ message: 'Login bem sucedido', user });
            console.log("Dados recebidos no login:", req.body);
        } else {
            res.status(401).json({ error: 'Email ou password invalido.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Um erro interno ocorreu.' });
    }
});

// atualiza username ou email
router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { username, email } = req.body;

    if (!username && !email) {
        res.status(400).json({ error: 'O campo username ou email é obrigatório.' });
        return;
    }

    try {
        const updatedUser = await userWorker.updateUserWithValidation(userId, { username, email });

        if (updatedUser) {
            res.status(200).json(updatedUser); 
        } else {
            res.status(404).json({ error: 'Utilizador não encontrado.' }); 
        }
    } catch (error) {
        console.error('Erro ao atualizar utilizador:', error);

        
        if (error instanceof Error) {
            res.status(400).json({ error: error.message }); 
        } else {
            res.status(500).json({ error: 'Erro interno ao atualizar utilizador.' }); 
        }
    }
});




  



export default router;
