import { NextApiRequest, NextApiResponse } from 'next';
import {closeClient} from "@/lib/db";
import {editMovie} from "@/features/movies/api/movieApi";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const movie = { _id: id, ...req.body };

            const result = await editMovie(movie);

            if (result.matchedCount === 0) {
                res.status(404).json({ error: 'Movie not found' });
            } else {
                res.status(200).json({ message: 'Movie updated successfully' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update Movie',err:error });
        }finally{
            await  closeClient();
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}