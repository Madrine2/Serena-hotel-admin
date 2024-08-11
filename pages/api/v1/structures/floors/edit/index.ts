import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {editFloors} from "@/features/structures/api/floorApi";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const floor = { _id: id, ...req.body };

            const result = await editFloors(floor);

            if (result.matchedCount === 0) {
                res.status(404).json({ error: 'Floor not found' });
            } else {
                res.status(200).json({ message: 'Floor updated successfully', result });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update Floor',err:error });
        }finally{
            await  closeClient();
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}