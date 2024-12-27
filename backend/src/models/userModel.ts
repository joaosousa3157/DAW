import { userDB } from '../dbInstances';


export interface User 
{
    username: string;
    email: string;
    password: string;
}

export default class userdbWorker {

    private db = userDB;

    public insertUser(user: User): Promise<User> {
        return new Promise((resolve, reject) => {
            this.db.insert(user, (err: Error | null, newUser: User) => {
                if (err) reject(err);
                else resolve(newUser);
            });
        });
    }

    public getAllUsers(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err: Error | null, users: User[]) => {
                err ? reject(err) : resolve(users);
            });
        });
    }

    public getUserById(id: string): Promise<User | null> {
        return new Promise((resolve, reject) => {
            this.db.findOne({ _id: id }, (err: Error | null, user: User | null) => {
                err ? reject(err) : resolve(user);
            });
        });
    }

    public updateUser(id: number, updatedUser: User): Promise<number> {
        return new Promise((resolve, reject) => {
            this.db.update({_id: id }, updatedUser, {}, (err: Error | null, numUpdated: number) => {
                err ? reject(err) : resolve(numUpdated);
            });
        });
    }

    public deleteUser(id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.db.remove({_id: id }, (err: Error | null, numRemoved: number) => {
                err ? reject(err) : resolve(numRemoved);
            });
        });
    }    
}
