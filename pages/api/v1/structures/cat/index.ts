import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {getBlocks} from "@/features/structures/api/blockApi";
import {Blocks} from "@/features/structures/models/blocks";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const block:Blocks[] = await getBlocks();

        res.status(200).json(block);
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await closeClient();
    }
}
