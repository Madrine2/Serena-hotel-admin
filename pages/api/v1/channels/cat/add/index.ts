import {closeClient} from "@/lib/db";
import {addCategoryChannel} from "@/features/channels/api/categoryApi";
import {NextApiRequest, NextApiResponse} from "next";
import {Category} from "@/features/channels/models/category";
import {checkCategoryExists} from "@/features/channels/helpers/checkCategoryExists";


export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const category:Category = req.body;
        if (!category.type || !category.image) {
            return res.status(400).json({ message: 'Type and image are required' });
        }

        const exists = await checkCategoryExists(category.type);
        if (exists) {
            return res.status(409).json({ message: 'Category type already exists' });
        }
        const response = await addCategoryChannel(category);
        res.status(200).json({message:"Successfully added",id:response.insertedId});

    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error',error });
    } finally {
        await closeClient();
    }
}