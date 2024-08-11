import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {Movie} from "@/features/movies/models/movie";
import {addMovie} from "@/features/movies/api/movieApi";
import {checkMovieExists} from "@/features/movies/helpers/checkMovieExists";
import {checkMovieCategoryExists} from "@/features/movies/helpers/checkMovieCategoryExists";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const movie:Movie = req.body;
        if (!movie.name || !movie.part || !movie.image ||
            !movie.url || !movie.category || !movie.price || !movie.duration) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const exists = await checkMovieExists(movie.name);
        if (exists) {
            return res.status(409).json({ message: 'Movie name already exists' });
        }
        const exist = await checkMovieCategoryExists(movie.category);
        if (!exist) {
            return res.status(409).json({ message: 'Movie category doesnt exists' });
        }
        const response = await addMovie(movie);
        res.status(200).json({message:"Successfully added",id:response.insertedId});

    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error',error });
    } finally {
        await closeClient();
    }
}