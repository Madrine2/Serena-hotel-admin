import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {getRooms} from "@/features/structures/api/roomApi";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const [rooms] = await Promise.all([getRooms()]);

        res.status(200).json(rooms);
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await closeClient();
    }
}
