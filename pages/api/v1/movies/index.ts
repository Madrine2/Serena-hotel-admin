import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {Movie} from "@/features/movies/models/movie";
import {getMovies} from "@/features/movies/api/movieApi";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const movie:Movie[] = await getMovies();

        res.status(200).json(movie);
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await closeClient();
    }
}
