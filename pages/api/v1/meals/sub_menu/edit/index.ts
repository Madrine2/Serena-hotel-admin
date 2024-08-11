import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {editSubMenu} from "@/features/meals/api/subApi";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;

            const sub_menu = { _id: id, ...req.body };

            const result = await editSubMenu(sub_menu);

            if (result.matchedCount === 0) {
                res.status(404).json({ error: 'SubMenu not found' });
            } else {
                res.status(200).json({ message: 'SubMenu updated successfully', result });
            }
        } catch (error) {
            console.error('Failed to update SubMenu', error);
            res.status(500).json({ error: 'Failed to update SubMenu' });
        } finally {
            await closeClient();
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};