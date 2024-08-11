import {closeClient, connectToDatabase} from "@/lib/db";
import {NextApiRequest, NextApiResponse} from "next";
import {Blocks} from "@/features/structures/models/blocks";
import {addBlock} from "@/features/structures/api/blockApi";


export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const block:Blocks = req.body;
        if (!block.name) {
            return res.status(400).json({ message: 'Block name is required' });
        }
        const db = await connectToDatabase("hotel");
        const blocksCollection = db.collection('blocks');


        const blockDoc = await blocksCollection.findOne({ name: block.name });
        if (blockDoc) {
            return res.status(400).json({message: 'Block already exists'});
        }
            const response = await addBlock(block);
        res.status(200).json({message:"Successfully added",id:response.insertedId});

    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error',error });
    } finally {
        await closeClient();
    }
}