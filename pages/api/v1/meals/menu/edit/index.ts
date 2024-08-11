import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {editMenu} from "@/features/meals/api/menuApi";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const menu = { _id: id, ...req.body };

            const result = await editMenu(menu);

            if (result.matchedCount === 0) {
                res.status(404).json({ error: 'Menu not found' });
            } else {
                res.status(200).json({ message: 'Menu updated successfully', result });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update Menu'});
        }finally{
            await  closeClient();
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}