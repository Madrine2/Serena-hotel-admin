import {closeClient, connectToDatabase} from "@/lib/db";
import {NextApiRequest, NextApiResponse} from "next";
import {Rooms} from "@/features/structures/models/rooms";
import {addRoom} from "@/features/structures/api/roomApi";


export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const db = await connectToDatabase("hotel");
        const roomsCollection = db.collection<Rooms>('rooms');
        const floorsCollection = db.collection('floors');
        const blocksCollection = db.collection('blocks');

        const room:Rooms = req.body;
        if (!room.number || !room.floor || !room.type) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const roomDoc = await roomsCollection.findOne({ name: room.number });
        if (roomDoc) {
            return res.status(400).json({message: 'Room already exists'});
        }
        const floorDoc = await floorsCollection.findOne({ name: room.floor });
        if (!floorDoc) {
            return res.status(400).json({message: 'Floor not found'});
        }

        const response = await addRoom(room);

        // Update totalRooms in the floors collection
        await floorsCollection.updateOne(
            { _id: floorDoc._id },
            { $inc: { totalRooms: 1 } }
        );

        // Update totalRooms in the blocks collection
        const blockDoc = await blocksCollection.findOne({ _id: floorDoc.block });
        if (blockDoc) {
            await blocksCollection.updateOne(
                { _id: blockDoc._id },
                { $inc: { totalRooms: 1 } }
            );
        }


        res.status(200).json({message:"Successfully added",id:response.insertedId});

    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error',error });
    } finally {
        await closeClient();
    }
}