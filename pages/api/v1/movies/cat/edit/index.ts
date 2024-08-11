import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {editCategoryMovie} from "@/features/movies/api/categoryApi";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const category = { _id: id, ...req.body };

            const result = await editCategoryMovie(category);

            if (result.matchedCount === 0) {
                res.status(404).json({ error: 'Category not found' });
            } else {
                res.status(200).json({ message: 'Category updated successfully', result });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update category'});
        }finally{
            await  closeClient();
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}