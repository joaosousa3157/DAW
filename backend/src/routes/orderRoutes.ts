import express, { Router } from 'express';
import orderDBWorker from '../models/orderModel';
import nodemailer from 'nodemailer';
import { wineDB } from '../dbInstances';

const router: Router = express.Router();
const orderWorker: orderDBWorker = new orderDBWorker();



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

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,                 
    secure: false,           
    auth: {
        user: '@ualg.pt', // EMAIL DA UNI
        pass: '',       // SENHA
    }
});

const sendOrderConfirmationEmail = async (email: string, order: any) => {
    try {
        const wineDetails = await Promise.all(order.wineIDs.map((wineID: string) => {
            return new Promise((resolve, reject) => {
                wineDB.findOne({ id: parseInt(wineID) }, (err: Error | null, wine: any) => {
                    if (err) reject(err);
                    else resolve(wine);
                });
            });
        }));

        const formattedWines = wineDetails
            .filter((wine: any) => wine !== null)
            .map((wine: any) => `- ${wine.name} (${wine.type})`)
            .join('\n');

        const now = new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' });

        const mailOptions = {
            from: '@ualg.pt', // email da uni
            to: email,
            subject: 'Confirmação de Compra',
            text: `Obrigado pela sua compra!\n\nDetalhes do pedido:\n${formattedWines}\n\nHora da compra: ${now}\n\nAgradecemos pela preferência!`,
        };

        await transporter.sendMail(mailOptions);
        console.log('E-mail de confirmação enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
};


router.post('/', async (req, res) => {
    
    const newOrder = req.body;

    try 
    {
        const createdOrder = await orderWorker.insertOrder(newOrder);

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

export default router