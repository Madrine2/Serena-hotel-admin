import {connectToDatabase} from "@/lib/db";
import {Db} from "mongodb";

export const checkMovieExists = async (name: string) => {
    const db: Db = await connectToDatabase("movies");
    const collection = db.collection('movies');

    const movie = await collection.findOne({ name });
    return !!movie;
}