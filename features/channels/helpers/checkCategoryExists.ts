import {connectToDatabase} from "@/lib/db";
import {Db} from "mongodb";

export const checkCategoryExists = async (type: string) => {
    const db: Db = await connectToDatabase("iptv");
    const collection = db.collection('channel_categories');

    const category = await collection.findOne({ type });
    return !!category;
}