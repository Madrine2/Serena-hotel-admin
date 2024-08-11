import {closeClient} from "@/lib/db";
import {NextApiRequest, NextApiResponse} from "next";
import {Menus} from "@/features/meals/models/menus";
import {addMenu} from "@/features/meals/api/menuApi";
import {checkMenuExists} from "@/features/meals/helpers/checkMenuExists";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const menu:Menus = req.body;
        if (!menu.name || !menu.image || !menu.active || !menu.details) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const exists = await checkMenuExists(menu.name);
        if (exists) {
            return res.status(409).json({ message: 'Menu name already exists' });
        }
        const response = await addMenu(menu);
        res.status(200).json({message:"Successfully added",id:response.insertedId});

    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error',error });
    } finally {
        await closeClient();
    }
}