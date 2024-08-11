import {closeClient} from "@/lib/db";
import {NextApiRequest, NextApiResponse} from "next";
import {MovieCategory} from "@/features/movies/models/movieCategory";
import {addCategoryMovie} from "@/features/movies/api/categoryApi";
import {checkMovieCategoryExists} from "@/features/movies/helpers/checkMovieCategoryExists";



export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const category:MovieCategory = req.body;
        if (!category.name) {
            return res.status(400).json({ message: 'Movie Category name is required' });
        }

        const exists = await checkMovieCategoryExists(category.name);
        if (exists) {
            return res.status(409).json({ message: 'Category name already exists' });
        }
        const response = await addCategoryMovie(category);
        res.status(200).json({message:"Successfully added",id:response.insertedId});

    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error',error });
    } finally {
        await closeClient();
    }
}