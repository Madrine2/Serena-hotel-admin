import { NextApiRequest, NextApiResponse } from "next";
import { closeClient, connectToDatabase } from "@/lib/db";
import { editRooms } from "@/features/structures/api/roomApi";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const { floor, ...roomData } = req.body; // Separate floor from the rest of the room data

            const db = await connectToDatabase("hotel");
            const floorsCollection = db.collection('floors');

            let floorId;
            if (floor) {
                const floorDoc = await floorsCollection.findOne({ name: floor });
                if (!floorDoc) {
                    return res.status(400).json({ error: 'Floor not found' });
                }
                floorId = floorDoc._id;
            }

            const room = { _id: id, ...roomData, floor: floorId };

            const result = await editRooms(room);

            if (result.matchedCount === 0) {
                res.status(404).json({ error: 'Room not found' });
            } else {
                res.status(200).json({ message: 'Room updated successfully', result });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update Room', err: error });
        } finally {
            await closeClient();
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
