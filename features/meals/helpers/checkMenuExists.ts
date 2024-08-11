import {connectToDatabase} from "@/lib/db";
import {Db} from "mongodb";

export const checkMenuExists = async (name: string) => {
    const db: Db = await connectToDatabase("hotel");
    const collection = db.collection('menus');

    const category = await collection.findOne({ name });
    return !!category;
}