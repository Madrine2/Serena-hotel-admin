import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {editCategoryChannel} from "@/features/channels/api/categoryApi";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const category = { _id: id, ...req.body };

            const result = await editCategoryChannel(category);

            if (result.matchedCount === 0) {
                res.status(404).json({ error: 'Category not found' });
            } else {
                res.status(200).json({ message: 'Category updated successfully', result });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update category',err:error });
        }finally{
            await  closeClient();
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}