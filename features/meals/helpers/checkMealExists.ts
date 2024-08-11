import {connectToDatabase} from "@/lib/db";
import {Db} from "mongodb";

export const checkMealExists = async (name: string) => {
    const db: Db = await connectToDatabase("hotel");
    const collection = db.collection('meals');

    const category = await collection.findOne({ name });
    return !!category;
}