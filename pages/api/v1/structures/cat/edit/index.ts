import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {editBlock} from "@/features/structures/api/blockApi";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const block = { _id: id, ...req.body };

            const result = await editBlock(block);

            if (result.matchedCount === 0) {
                res.status(404).json({ error: 'Block not found' });
            } else {
                res.status(200).json({ message: 'Block updated successfully', result });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update Block',err:error });
        }finally{
            await  closeClient();
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}