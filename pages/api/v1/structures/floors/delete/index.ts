import { ParsedUrlQuery } from "node:querystring";
import { NextApiRequest, NextApiResponse } from "next";
import { closeClient, connectToDatabase } from "@/lib/db";
import { deleteFloor } from "@/features/structures/api/floorApi";
import { ObjectId } from "mongodb";

interface QueryParams extends ParsedUrlQuery {
    id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        try {
            const { id } = req.query as QueryParams;

            if (!id) {
                return res.status(400).json({ error: 'Floor ID is required' });
            }

            const { deletedCount, blockId } = await deleteFloor(id);

            if (deletedCount === 0) {
                return res.status(404).json({ error: 'Floor not found' });
            }

            if (blockId) {
                const db = await connectToDatabase("hotel");
                const blocksCollection = db.collection("blocks");

                // Update the totalFloors field in the blocks collection
                await blocksCollection.updateOne(
                    { _id: new ObjectId(blockId) },
                    { $inc: { totalFloors: -1 } }
                );
            }

            res.status(200).json({ message: 'Floor deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete Floor', err: error });
        } finally {
            await closeClient();
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
