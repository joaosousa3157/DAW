import Datastore from 'nedb';
import path from 'path';

export interface Wine 
{
    id: number,
    name: string,
    type: string,
    price: number
    description: string,
    vol: number,
    capacity: number,
    image: string
}

export default class winedbWorker 
{
    private wineDB: Nedb;

    constructor()
    {
        this.wineDB = new Datastore({
            filename: path.join(__dirname, "database", "wine.db"),
            autoload: true
        });
    }

    public insertWine(wine: Wine) : Promise<Wine>
    {
        return new Promise((resolve, reject)=>{

            this.wineDB.insert(wine, (err: Error | null, newWine: Wine) =>{

                err ? reject(err) : resolve(newWine);

            });
        });
    }

    public getAllWines() : Promise<Wine[]> 
    {
        return new Promise((resolve, reject) =>{

            this.wineDB.find({}, (err: Error | null, wines: Wine[]) =>{

                err ? reject(err) : resolve(wines);

            });
        });

    }

    public getWineById(id: number): Promise<Wine | null>
    {
        return new Promise((resolve, reject) =>{

            this.wineDB.findOne({ id: id }, (err: Error | null, wine: Wine | null) => {

                err ? reject(err) : resolve(wine);

            });
        });
    }

    public updateWine(id: number, updatedWine: Wine): Promise<number>
    {
        return new Promise((resolve, reject) =>{

            this.wineDB.update({id:id}, updatedWine, {}, (err: Error | null, idUpdated: number)=>{

                err ? reject(err): resolve(idUpdated)

            });
        });
    }

    public deleteWine(id: number): Promise<number> 
    {
        return new Promise((resolve, reject) =>{

            this.wineDB.remove({id:id}, (err: Error | null, idRemoved: number) =>{
                
                err ? reject(err) : resolve(idRemoved);
            });
        });
    }

    public filterWines(filter: Partial<Wine>): Promise<Wine[]> {
        return new Promise((resolve, reject) => {

            this.wineDB.find(filter, (err: Error | null, wines: Wine[]) => {

                err ? reject(err) : resolve(wines);
            });
        });
    }


}