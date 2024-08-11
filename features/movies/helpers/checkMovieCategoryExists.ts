import {connectToDatabase} from "@/lib/db";
import {Db} from "mongodb";

export const checkMovieCategoryExists = async (name: string) => {
    const db: Db = await connectToDatabase("movies");
    const collection = db.collection('movie_categories');

    const category = await collection.findOne({ name });
    return !!category;
}