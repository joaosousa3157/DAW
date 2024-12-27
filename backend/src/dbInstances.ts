import path from 'path';
import Datastore from 'nedb';

export const orderDB = new Datastore({
    filename: path.join(__dirname, 'models', 'database', 'order.db'),
    autoload: true,
});

export const reviewDB = new Datastore({
    filename: path.join(__dirname, 'models', 'database', 'review.db'),
    autoload: true,
});

export const userDB = new Datastore({
    filename: path.join(__dirname, 'models', 'database', 'user.db'),
    autoload: true,
});

export const wineDB = new Datastore({
    filename: path.join(__dirname, 'models', 'database', 'wine.db'),
    autoload: true,
});
