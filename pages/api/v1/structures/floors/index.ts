import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {getFloors} from "@/features/structures/api/floorApi";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const floors = await getFloors();

        // Send the fetched data as JSON response
        res.status(200).json(floors);
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await closeClient();
    }
}
