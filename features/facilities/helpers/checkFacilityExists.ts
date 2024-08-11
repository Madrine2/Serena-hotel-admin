import {connectToDatabase} from "@/lib/db";
import {Db} from "mongodb";

export const checkFacilityExists = async (name: string) => {
    const db: Db = await connectToDatabase("hotel");
    const collection = db.collection('facilities');

    const facility = await collection.findOne({ name });
    return !!facility;
}