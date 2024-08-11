import {connectToDatabase} from "@/lib/db";
import {Db} from "mongodb";

export const checkBrandExists = async (tvBrand: string) => {
    const db: Db = await connectToDatabase("hotel");
    const collection = db.collection('tv_brands');

    const brand = await collection.findOne( {tvBrand });
    return !!brand;
}