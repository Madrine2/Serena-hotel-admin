import {closeClient, connectToDatabase} from "@/lib/db";
import {NextApiRequest, NextApiResponse} from "next";
import {Floors} from "@/features/structures/models/floors";
import {addFloor} from "@/features/structures/api/floorApi";
import {Blocks} from "@/features/structures/models/blocks";


export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const db = await connectToDatabase("hotel");
        const blocksCollection = db.collection<Blocks>('blocks');
        const floorsCollection = db.collection('floors');

        const floor:Floors = req.body;
        if (!floor.name || !floor.block) {
            return res.status(400).json({ message: 'Floor name is required' });
        }

        const floorDoc = await floorsCollection.findOne({ name: floor.name });
        if (floorDoc) {
            return res.status(400).json({message: 'Floor already exists'});
        }

        const blockDoc = await blocksCollection.findOne({ name: floor.block });
        if (!blockDoc) {
            return res.status(400).json({ message: 'Block not found' });
        }

        const response = await addFloor(floor);

        const updateResponse = await blocksCollection.updateOne(
            { _id: blockDoc._id },
            { $inc: { totalFloors: 1 } }
        );

        if (updateResponse.modifiedCount === 0) {
            const updateResponse = await blocksCollection.updateOne(
                {_id: blockDoc._id},
                {
                    $inc: {totalFloors: 1},
                    $setOnInsert: {totalFloors: 1},
                }
            );

            if (updateResponse.modifiedCount === 0) {
                return res.status(500).json({message: 'Failed to update block totalFloors'});
            }
        }

        res.status(200).json({message:"Successfully added",id:response.insertedId});

    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error',error });
    } finally {
        await closeClient();
    }
}