import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {MovieCategory} from "@/features/movies/models/movieCategory";
import {getCategoryMovies} from "@/features/movies/api/categoryApi";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const categories:MovieCategory[] = await getCategoryMovies();

        res.status(200).json(categories);
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await closeClient();
    }
}
