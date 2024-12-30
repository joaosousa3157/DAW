import { userDB } from '../dbInstances';

// estrutura do utilizador
export interface User 
{
    username: string; // nome de utilizador
    email: string; // email do utilizador
    password: string; // password do utilizador
}

// classe para gerir utilizadores na base de dados
export default class userdbWorker {

    private db = userDB; // referencia a base de dados

    async insertUser(newUser: { email: string; username: string; password: string }) {
        // insere um novo utilizador
        const existingUser = await this.getUserByEmail(newUser.email); // verifica se o email ja existe
        if (existingUser) {
            throw new Error("Email já registrado."); // erro se o email ja estiver registrado
        }
    
        const result = await this.db.insert(newUser); // insere o novo utilizador
        return result; // devolve o utilizador inserido
    }
    
    public getAllUsers(): Promise<User[]> {
        // devolve todos os utilizadores
        return new Promise((resolve, reject) => {
            this.db.find({}, (err: Error | null, users: User[]) => {
                err ? reject(err) : resolve(users); // resolve com os utilizadores ou rejeita se erro
            });
        });
    }

    public getUserById(id: string): Promise<User | null> {
        // devolve um utilizador pelo id
        return new Promise((resolve, reject) => {
            this.db.findOne({ _id: id }, (err: Error | null, user: User | null) => {
                err ? reject(err) : resolve(user); // resolve com o utilizador ou rejeita se erro
            });
        });
    }

    public updateUser(id: number, updatedUser: User): Promise<number> {
        // atualiza um utilizador pelo id
        return new Promise((resolve, reject) => {
            this.db.update({_id: id }, updatedUser, {}, (err: Error | null, numUpdated: number) => {
                err ? reject(err) : resolve(numUpdated); // resolve com o numero de utilizadores atualizados ou rejeita se erro
            });
        });
    }

    public deleteUser(id: string): Promise<number> {
        // remove um utilizador pelo id
        return new Promise((resolve, reject) => {
            this.db.remove({_id: id }, (err: Error | null, numRemoved: number) => {
                err ? reject(err) : resolve(numRemoved); // resolve com o numero de utilizadores removidos ou rejeita se erro
            });
        });
    }   
    
    public getUserByEmail(email: string): Promise<User | null> {
        // devolve um utilizador pelo email
        return new Promise((resolve, reject) => {
            this.db.findOne({ email }, (err: Error | null, user: User | null) => {
                if (err) reject(err); // rejeita se erro
                else resolve(user); // resolve com o utilizador
            });
        });
    }
}
