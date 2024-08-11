import {NextApiRequest, NextApiResponse} from "next";
import {editTvBrand} from "@/features/tvs/api/brandApi";
import {closeClient} from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const tv_brand = { _id: id, ...req.body };

            const result = await editTvBrand(tv_brand);

            if (result.matchedCount === 0) {
                res.status(404).json({ error: 'Tv Brand not found' });
            } else {
                res.status(200).json({ message: 'Tv Brand  updated successfully', result });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update Tv Brand ',err:error });
        }finally{
            await  closeClient();
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}