"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wineModel_1 = __importDefault(require("../models/wineModel"));
const router = express_1.default.Router();
const wineWorker = new wineModel_1.default();
const handleError = (res, error) => {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    }
    else {
        res.status(500).json({ error: "An unknown error occurred" });
    }
};
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wines = yield wineWorker.getAllWines();
        res.status(200).json(wines);
    }
    catch (error) {
        handleError(res, error);
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wineId = Number(req.params.id);
    if (!Number.isInteger(wineId)) {
        res.status(400).json({ error: "Invalid wine ID" });
    }
    try {
        const wine = yield wineWorker.getWineById(wineId);
        if (wine) {
            res.status(200).json(wine);
        }
        else {
            res.status(404).json({ message: `Wine with ID ${wineId} not found` });
        }
    }
    catch (error) {
        handleError(res, error);
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newWine = req.body;
    if (!newWine.name || !newWine.type || !newWine.price) {
        res.status(400).json({ error: "Missing required wine fields" });
    }
    try {
        const createdWine = yield wineWorker.insertWine(newWine);
        res.status(201).json(createdWine);
    }
    catch (error) {
        handleError(res, error);
    }
}));
exports.default = router;
