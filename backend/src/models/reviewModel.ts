import Datastore from 'nedb';

// estrutura da review
export interface Review {
    userID: string; // id do utilizador que fez a review
    wineID: string; // id do vinho que foi avaliado
    rating: number; // avaliacao do vinho (1-5)
    comment?: string; // comentario opcional
    dateTime?: string; // data e hora da review
}

// classe para trabalhar com reviews na base de dados
export default class ReviewdbWorker {
    private db: Datastore<Review>; // referencia a base de dados

    constructor(db: Datastore<Review>) {
        this.db = db; // inicializa a base de dados
    }

    public insertReview(review: Review): Promise<Review> {
        // insere uma nova review na base de dados
        return new Promise((resolve, reject) => {
            this.db.insert(review, (err: Error | null, newReview: Review) => {
                if (err) {
                    reject(err); // rejeita se erro
                } else {
                    resolve(newReview); // resolve com a nova review
                }
            });
        });
    }

    public getAllReviews(): Promise<Review[]> {
        // devolve todas as reviews
        return new Promise((resolve, reject) => {
            this.db.find({}, (err: Error | null, reviews: Review[]) => {
                if (err) {
                    reject(err); // rejeita se erro
                } else {
                    resolve(reviews); // resolve com a lista de reviews
                }
            });
        });
    }

    public deleteReview(id: string): Promise<number> {
        // remove uma review especifica pelo id
        return new Promise((resolve, reject) => {
            this.db.remove({ _id: id }, {}, (err: Error | null, numRemoved: number) => {
                if (err) {
                    reject(err); // rejeita se erro
                } else {
                    resolve(numRemoved); // resolve com o numero de reviews removidas
                }
            });
        });
    }

    // pega as reviews pelo id do vinho
    public getReviewsByWineID(wineID: string): Promise<Review[]> {
        return new Promise((resolve, reject) => {
            this.db.find({ wineID }, (err: Error | null, reviews: Review[]) => {
                if (err) reject(err);
                else resolve(reviews);
            });
        });
    }
}
