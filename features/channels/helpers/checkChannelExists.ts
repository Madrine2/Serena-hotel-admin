import {connectToDatabase} from "@/lib/db";
import {Db} from "mongodb";

export const checkChannelExists = async (name: string) => {
    const db: Db = await connectToDatabase("iptv");
    const collection = db.collection('channels');

    const category = await collection.findOne({ name });
    return !!category;
}