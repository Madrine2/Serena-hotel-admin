import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {TvBrand} from "@/features/tvs/models/brand";
import {addTvBrand} from "@/features/tvs/api/brandApi";
import {checkBrandExists} from "@/features/tvs/helpers/checkBrandExists";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const tv_brand:TvBrand = req.body;
        if (!tv_brand.tvBrand) {
            return res.status(400).json({ message: 'Tv Brand is required' });
        }

        const exists = await checkBrandExists(tv_brand.tvBrand);
        if (exists) {
            return res.status(409).json({ message: 'Tv Brand already exists' });
        }
        const response = await addTvBrand(tv_brand);
        res.status(200).json({message:"Successfully added",id:response.insertedId});

    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error',error });
    } finally {
        await closeClient();
    }
}