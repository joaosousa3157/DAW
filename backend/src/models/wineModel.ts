import { wineDB } from '../dbInstances';


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
    private db = wineDB;

    public insertWine(wine: Wine): Promise<Wine> {
        return new Promise((resolve, reject) => {
            this.db.insert(wine, (err: Error | null, newWine: Wine) => {
                if (err) reject(err);
                else resolve(newWine);
            });
        });
    }

    public getAllWines() : Promise<Wine[]> 
    {
        return new Promise((resolve, reject) =>{

            this.db.find({}, (err: Error | null, wines: Wine[]) =>{

                err ? reject(err) : resolve(wines);

            });
        });

    }

    public getWineById(id: number): Promise<Wine | null>
    {
        return new Promise((resolve, reject) =>{

            this.db.findOne({ id: id }, (err: Error | null, wine: Wine | null) => {

                err ? reject(err) : resolve(wine);

            });
        });
    }

    public updateWine(id: number, updatedWine: Wine): Promise<number>
    {
        return new Promise((resolve, reject) =>{

            this.db.update({id:id}, updatedWine, {}, (err: Error | null, idUpdated: number)=>{

                err ? reject(err): resolve(idUpdated)

            });
        });
    }

    public deleteWine(id: number): Promise<number> 
    {
        return new Promise((resolve, reject) =>{

            this.db.remove({id:id}, (err: Error | null, idRemoved: number) =>{
                
                err ? reject(err) : resolve(idRemoved);
            });
        });
    }

    public filterWines(filter: Partial<Wine>): Promise<Wine[]> 
    {
        return new Promise((resolve, reject) => 
        {
            if (filter.id !== undefined) filter.id = parseInt(filter.id as any);
            if (filter.price !== undefined) filter.price = parseFloat(filter.price as any);
            if (filter.vol !== undefined) filter.vol = parseFloat(filter.vol as any);
            if (filter.capacity !== undefined) filter.capacity = parseInt(filter.capacity as any);
            
            this.db.find(filter, (err: Error | null, wines: Wine[]) => {

                err ? reject(err) : resolve(wines);
            });
        });
    }


}