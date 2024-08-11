import { closeClient } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import {addOrder} from "@/features/meals/api/orderApi";
import {Order} from "@/features/meals/models/order";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const order: Order = req.body;
        if (!order.orders || !order.state || !order.tvId || !order.totalAmount ) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Add the order
        const response = await addOrder(order);
        res.status(200).json({ message: "Successfully added", id: response.insertedId });

    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    } finally {
        await closeClient();
    }
}
