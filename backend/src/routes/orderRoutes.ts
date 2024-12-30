import express, { Router } from 'express';
import orderDBWorker from '../models/orderModel';
import nodemailer from 'nodemailer';
import { productDB } from '../dbInstances';

const router: Router = express.Router();
const orderWorker: orderDBWorker = new orderDBWorker();

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
            console.log(req.query)
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
        user: '@ualg.pt', // email da uni
        pass: '',       // senha
    }
});

// funcao para enviar confirmacao de pedido por email
const sendOrderConfirmationEmail = async (email: string, order: any) => {
    try {
        // obtem detalhes dos vinhos no pedido
        const wineDetails = await Promise.all(order.wineIDs.map((wineID: string) => {
            return new Promise((resolve, reject) => {
                productDB.findOne({ id: parseInt(wineID) }, (err: Error | null, wine: any) => {
                    if (err) reject(err);
                    else resolve(wine);
                });
            });
        }));

        // formata os vinhos para enviar no email
        const formattedWines = wineDetails
            .filter((wine: any) => wine !== null)
            .map((wine: any) => `- ${wine.name} (${wine.type})`)
            .join('\n');

        // pega data e hora atual formatada
        const now = new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' });

        // cria configuracao do email
        const mailOptions = {
            from: '@ualg.pt', // email da uni
            to: email,
            subject: 'Confirmação de Compra',
            text: `Obrigado pela sua compra!\n\nDetalhes do pedido:\n${formattedWines}\n\nHora da compra: ${now}\n\nAgradecemos pela preferência!`,
        };

        // envia o email
        await transporter.sendMail(mailOptions);
        console.log('E-mail de confirmação enviado com sucesso!');
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

        // envia email de confirmacao se email do usuario existir
        const userEmail = newOrder.userEmail;
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
