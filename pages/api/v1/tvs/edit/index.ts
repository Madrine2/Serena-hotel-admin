import { NextApiRequest, NextApiResponse } from 'next';
import {editTv} from "@/features/tvs/api/tvApi";
import {closeClient} from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const tv = { _id: id, ...req.body };

            const result = await editTv(tv);

            if (result.matchedCount === 0) {
                res.status(404).json({ error: 'TV not found' });
            } else {
                res.status(200).json({ message: 'TV updated successfully', result });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update TV',err:error });
        }finally{
            await  closeClient();
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}