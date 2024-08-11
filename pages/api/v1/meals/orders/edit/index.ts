import { NextApiRequest, NextApiResponse } from 'next';
import {closeClient} from "@/lib/db";
import {editOrder} from "@/features/meals/api/orderApi";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const order = { _id: id, ...req.body };

            const result = await editOrder(order);

            if (result.matchedCount === 0) {
                res.status(404).json({ error: 'Order not found' });
            } else {
                res.status(200).json({ message: 'Order updated successfully' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update Order',err:error });
        }finally{
            await  closeClient();
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}