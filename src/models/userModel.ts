import Datastore from 'nedb';
import path from 'path';


export interface User 
{
    username: string;
    email: string;
    password: string;
}

export default class userdbWorker {

    private userDB: Nedb;

    constructor() {
        this.userDB = new Datastore({
            filename: path.join(__dirname, "database", "user.db"),
            autoload: true
        });
    }

    public insertUser(user: User): Promise<User> 
    {        
        return new Promise((resolve, reject) => 
        {
            this.userDB.insert(user, (err: Error | null, newUser: User) => 
            {
                err ? reject(err) : resolve(newUser);
            });
        });
    }

    public getAllUsers(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            this.userDB.find({}, (err: Error | null, users: User[]) => {
                err ? reject(err) : resolve(users);
            });
        });
    }

    public getUserById(id: string): Promise<User | null> {
        return new Promise((resolve, reject) => {
            this.userDB.findOne({ _id: id }, (err: Error | null, user: User | null) => {
                err ? reject(err) : resolve(user);
            });
        });
    }

    public updateUser(id: number, updatedUser: User): Promise<number> {
        return new Promise((resolve, reject) => {
            this.userDB.update({_id: id }, updatedUser, {}, (err: Error | null, numUpdated: number) => {
                err ? reject(err) : resolve(numUpdated);
            });
        });
    }

    public deleteUser(id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.userDB.remove({_id: id }, (err: Error | null, numRemoved: number) => {
                err ? reject(err) : resolve(numRemoved);
            });
        });
    }    
}
