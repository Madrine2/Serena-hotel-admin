import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {TvBrand} from "@/features/tvs/models/brand";
import {getTvBrand} from "@/features/tvs/api/brandApi";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const tv_brands:TvBrand[] = await getTvBrand();

        res.status(200).json(tv_brands);
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await closeClient();
    }
}
