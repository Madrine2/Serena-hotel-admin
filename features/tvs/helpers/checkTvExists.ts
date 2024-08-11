import {connectToDatabase} from "@/lib/db";
import {Db} from "mongodb";

export const checkTvExists = async (serialNumber: string) => {
    const db: Db = await connectToDatabase("hotel");
    const collection = db.collection('tvs');

    const tv = await collection.findOne( { serialNumber });
    return !!tv;
}