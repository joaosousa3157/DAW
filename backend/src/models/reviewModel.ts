import Datastore from 'nedb';

export interface Review {
    userID: string;
    wineID: string;
    rating: number;
    comment?: string;
    dateTime?: string;
}

export default class ReviewdbWorker {
    private db: Datastore<Review>;

    constructor(db: Datastore<Review>) {
        this.db = db;
    }

    public insertReview(review: Review): Promise<Review> {
        return new Promise((resolve, reject) => {
            this.db.insert(review, (err: Error | null, newReview: Review) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(newReview);
                }
            });
        });
    }

    public getAllReviews(): Promise<Review[]> {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err: Error | null, reviews: Review[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reviews);
                }
            });
        });
    }

    public deleteReview(id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.db.remove({ _id: id }, {}, (err: Error | null, numRemoved: number) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(numRemoved);
                }
            });
        });
    }
}
