import express, { Router } from 'express';
import orderDBWorker from '../models/orderModel';
import nodemailer from 'nodemailer';

const router: Router = express.Router();
const orderWorker: orderDBWorker = new orderDBWorker();




//IMPORTANTE: Não consegui por o email com o nome do vinho está
//só a enviar o email todo istranho. Não sei porque não consigo usar
//as outras classes aqui



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
    const mailOptions = {
        from: '@ualg.pt',//email da uni
        to: email,
        subject: 'Confirmação de Compra',
        text: `Obrigado pela sua compra! Detalhes do pedido:\n\n${JSON.stringify(order, null, 2)}`,
    };

    try {
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