import express, { Router } from 'express';
import productsdbWorker from '../models/productModel';

const router: Router = express.Router();
const productsWorker: productsdbWorker = new productsdbWorker();

// funcao para tratar erros e enviar resposta com status 500
const handleError = (res: express.Response, error: unknown) => {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};

// rota para obter vinhos, pode filtrar se tiver query
router.get('/', async (req, res) => {
    try {
        if (Object.keys(req.query).length === 0) {
            // devolve todos os vinhos se nao houver query
            const wines = await productsWorker.getAllproducts();
            res.status(200).json(wines);
        } else {
            // filtra vinhos com base na query
            const wines = await productsWorker.filterProducts(req.query);
            res.status(200).json(wines);
        }
    } catch (error) {
        handleError(res, error);
    }
});

// rota para obter vinho pelo id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const wine = await productsWorker.getProductById(id);
        if (wine) {
            res.status(200).json(wine);// vinho encontrado, envia como resposta
        } else {
            res.status(404).json({ error: "Vinho não encontrado." });// vinho nao existe, retorna erro 404
        }
    } catch (error) {
        console.error("Erro ao buscar o vinho:", error); // Log de erro
        res.status(500).json({ error: "Erro ao buscar o vinho." });// erro interno do servidor
    }
});


// rota para criar novo vinho
router.post('/', async (req, res) => {
    const newWine = req.body;

    // verifica se os campos obrigatorios estao presentes
    if (!newWine.name || !newWine.type || !newWine.price) {
        res.status(400).json({ error: `Missing required wine fields on wine ${newWine.id}` });
        return;
    }

    try {
        const createdWine = await productsWorker.insertProduct(newWine);
        res.status(201).json(createdWine);
    } catch (error) {
        handleError(res, error);
    }
});

// rota para deletar vinho pelo id
router.delete('/:id', async (req, res) => {
    const wineId = Number(req.params.id); // converte o id do vinho recebido como parametro para numero

    try {
        const deletedCount = await productsWorker.deleteProduct(wineId);// tenta deletar o produto usando o id fornecido

        if (deletedCount > 0) {
            // se conseguiu deletar pelo menos um registro
            res.status(200).json({ message: `Wine with ID ${wineId} deleted successfully` });
        } else {
            // se nao encontrou nenhum registro com o id fornecido
            res.status(404).json({ message: `Wine with ID ${wineId} not found` });
        }
    } catch (error) {
        handleError(res, error);// trata qualquer erro que ocorra durante a operacao
    }
});

export default router;
