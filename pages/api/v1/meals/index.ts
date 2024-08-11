import { NextApiRequest, NextApiResponse } from "next";
import { closeClient } from "@/lib/db";
import {getMeals} from "@/features/meals/api/mealApi";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const meals = await getMeals();
        res.status(200).json(meals);
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await closeClient();
    }
}