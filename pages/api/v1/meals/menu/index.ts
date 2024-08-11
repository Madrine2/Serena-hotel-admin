import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {Menus} from "@/features/meals/models/menus";
import {getMenu} from "@/features/meals/api/menuApi";


export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const menu:Menus[] = await getMenu();

        res.status(200).json(menu);
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await closeClient();
    }
}
