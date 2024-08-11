import { closeClient } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { SubMenus } from "@/features/meals/models/sub_menus";
import { checkSubMenuExists } from "@/features/meals/helpers/checkSubMenuExists";
import { addSubMenu } from "@/features/meals/api/subApi";
import { checkMenuExists } from "@/features/meals/helpers/checkMenuExists";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const sub_menu: SubMenus = req.body;
        if (!sub_menu.menu || !sub_menu.data) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the menu exists
        const menuExists = await checkMenuExists(sub_menu.menu);
        if (!menuExists) {
            return res.status(409).json({ message: 'Menu doesnt exist' });
        }

        // Check if any submenu in the provided data already exists
        for (const item of sub_menu.data) {
            const exists = await checkSubMenuExists(item.name);
            if (exists) {
                return res.status(409).json({ message: `SubMenu '${item.name}' already exists` });
            }
        }

        // Add the submenu
        const response = await addSubMenu(sub_menu);
        res.status(200).json({ message: "Successfully added", id: response.insertedId });

    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    } finally {
        await closeClient();
    }
}
