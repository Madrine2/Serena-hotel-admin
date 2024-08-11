import {ParsedUrlQuery} from "node:querystring";
import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {deleteOrder} from "@/features/meals/api/orderApi";

interface QueryParams extends ParsedUrlQuery {
    id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE'){
        try {
            const { id } = req.query as QueryParams;

            if (!id) {
                return res.status(400).json({ error: 'Order ID is required' });
            }

            const result = await deleteOrder(id);

            if (result.deletedCount === 0) {
                res.status(404).json({ error: 'Order not found' });
            } else {
                res.status(200).json({ message: 'Order deleted successfully' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete Order',err:error });
        }finally{
            await  closeClient();
        }
    }else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}