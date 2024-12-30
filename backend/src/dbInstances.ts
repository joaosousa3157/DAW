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

export const productDB = new Datastore({
    filename: path.join(__dirname, 'models', 'database', 'products.db'),
    autoload: true,
}); //serve para dar load as bd, instancias
