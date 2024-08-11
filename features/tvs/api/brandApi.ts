import {connectToDatabase} from "@/lib/db";
import {ObjectId} from "mongodb";
import {TvBrand} from "@/features/tvs/models/brand";


export const addTvBrand= async (tv_brand:TvBrand)=> {
    const db = await connectToDatabase("hotel");
    const collection = db.collection('tv_brands');


    const {tvBrand} = tv_brand;
    const newTvBrand = {
        tvBrand,
        createdAt: new Date(),
    }

    return await collection.insertOne(newTvBrand);
}


export const getTvBrand = async ()=>{
    const db = await connectToDatabase("hotel");
    const collection = db.collection<TvBrand>('tv_brands');

    // Fetch items from the collection
    const items:TvBrand[] = await collection.find({}).toArray();

    return items;
}

export const editTvBrand = async (tv_brand:TvBrand) => {
    const db = await connectToDatabase("hotel");
    const collection = db.collection('tv_brands');

    if (!tv_brand._id) {
        throw new Error('Tv Brand must have an _id field');
    }

    const { _id, ...updateData } = tv_brand;

    return  await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updateData }
    );
}
export const deleteTvBrand = async (id:string) => {
    const db = await connectToDatabase("hotel");
    const collection = db.collection('tv_brands');
    return  await collection.deleteOne({ _id: new ObjectId(id) });
}