import { userDB } from '../dbInstances';


export interface User 
{
    username: string;
    email: string;
    password: string;
}

export default class userdbWorker {

    private db = userDB;

    async insertUser(newUser: { email: string; password: string }) {
        const existingUser = await this.getUserByEmail(newUser.email);
        if (existingUser) {
            throw new Error("Email already registered.");
        }
    
        // Insira o novo usuário no banco de dados
        const result = await this.db.insert(newUser); // exemplo de método genérico
        return result;
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
    
    public getUserByEmail(email: string): Promise<User | null> {
        return new Promise((resolve, reject) => {
            this.db.findOne({ email }, (err: Error | null, user: User | null) => {
                if (err) reject(err);
                else resolve(user);
            });
        });
    }
    
}
