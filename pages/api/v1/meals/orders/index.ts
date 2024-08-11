import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {getOrders} from "@/features/meals/api/orderApi";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const order = await getOrders();
        res.status(200).json(order);
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await closeClient();
    }
}