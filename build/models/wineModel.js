"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nedb_1 = __importDefault(require("nedb"));
const path_1 = __importDefault(require("path"));
class winedbWorker {
    constructor() {
        this.wineDB = new nedb_1.default({
            filename: path_1.default.join(__dirname, "database", "wine.db"),
            autoload: true
        });
    }
    insertWine(wine) {
        return new Promise((resolve, reject) => {
            this.wineDB.insert(wine, (err, newWine) => {
                err ? reject(err) : resolve(newWine);
            });
        });
    }
    getAllWines() {
        return new Promise((resolve, reject) => {
            this.wineDB.find({}, (err, wines) => {
                err ? reject(err) : resolve(wines);
            });
        });
    }
    getWineById(id) {
        return new Promise((resolve, reject) => {
            this.wineDB.findOne({ id: id }, (err, wine) => {
                err ? reject(err) : resolve(wine);
            });
        });
    }
    updateWine(id, updatedWine) {
        return new Promise((resolve, reject) => {
            this.wineDB.update({ id: id }, updatedWine, {}, (err, idUpdated) => {
                err ? reject(err) : resolve(idUpdated);
            });
        });
    }
    deleteWine(id) {
        return new Promise((resolve, reject) => {
            this.wineDB.remove({ id: id }, (err, idRemoved) => {
                err ? reject(err) : resolve(idRemoved);
            });
        });
    }
}
exports.default = winedbWorker;
