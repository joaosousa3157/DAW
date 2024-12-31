import express, { Router } from 'express';
import orderDBWorker from '../models/orderModel';
import userdbWorker from '../models/userModel';
import productsdbWorker from 'models/productModel';
import nodemailer from 'nodemailer';
import { productDB, userDB } from '../dbInstances';
import * as dotenv from 'dotenv';

dotenv.config();
const mailUser = process.env.MAILUSER;
const mailPASS = process.env.MAILPASS


const router: Router = express.Router();
const orderWorker: orderDBWorker = new orderDBWorker();
const userWorker: userdbWorker = new userdbWorker();



// trata erros e devolve resposta com status 500
const handleError = (res: express.Response, error: unknown) => {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};

// rota para obter pedidos
router.get('/', async (req, res) => {
    try 
    {
        // se nao houver query devolve todos os pedidos
        if (Object.keys(req.query).length === 0) 
        {
            const wines = await orderWorker.getAllOrders();
            res.status(200).json(wines);
        } 
        else 
        {
            // filtra pedidos com base nos parametros da query
            const wines = await orderWorker.filterOrders(req.query);

            res.status(200).json(wines);
        }

    } 
    catch (error) 
    {
        handleError(res, error)
    }
});

// configura o nodemailer para enviar emails
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,                 
    secure: false,           
    auth: {
        user: mailUser, // email da uni
        pass: mailPASS,       // senha
    }
});

// funcao para enviar confirmacao de pedido por email
const sendOrderConfirmationEmail = async (email: string, order: any) => {

    
    try {

        const formattedWines = order.cartItems.map((wine: any) => {
            return `Nome: ${wine.name}, Preço: ${wine.price}, Quantidade: ${wine.quantity}\n`;
        }).join('');

        // pega data e hora atual formatada
        const now = new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' });

        // cria configuracao do email
        const mailOptions = {
            from: mailUser, // email da uni
            to: email,
            subject: 'Confirmação de Compra',
            text: `Obrigado pela sua compra!\n\nDetalhes do pedido:\n${formattedWines}\n\nHora da compra: ${now}\n\nAgradecemos pela preferência!`,
        };

        // envia o email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
};

// rota para criar um novo pedido
router.post('/', async (req, res) => {
    
    const newOrder = req.body;
    try 
    {
        // insere o pedido na base de dados
        const createdOrder = await orderWorker.insertOrder(newOrder);

        const user = await userWorker.getUserById(createdOrder.userID);

        // envia email de confirmacao se email do usuario existir
        const userEmail = user?.email
        if (userEmail) {
            sendOrderConfirmationEmail(userEmail, createdOrder);
        }

        res.status(201).json(createdOrder);
    } 
    catch (error) 
    {
        handleError(res, error);
    }
});

export default router;
