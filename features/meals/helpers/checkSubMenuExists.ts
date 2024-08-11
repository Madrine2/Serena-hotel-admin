import { connectToDatabase } from "@/lib/db";
import { Db } from "mongodb";

export const checkSubMenuExists = async (name: string) => {
    const db: Db = await connectToDatabase("hotel");
    const collection = db.collection('sub_menus');

    // Query to check if any document in the collection contains the submenu name in the data array
    const category = await collection.findOne({
        "data.name": name
    });

    return !!category;
};
