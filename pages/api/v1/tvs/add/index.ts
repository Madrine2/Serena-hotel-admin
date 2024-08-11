import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {TV} from "@/features/tvs/models/tv";
import {checkTvExists} from "@/features/tvs/helpers/checkTvExists";
import {checkBrandExists} from "@/features/tvs/helpers/checkBrandExists";
import {addTvs} from "@/features/tvs/api/tvApi";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const tv:TV = req.body;
        if (!tv.status || !tv.serialNumber || !tv.floor ||
            !tv.room || !tv.tvBrand) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const exists = await checkTvExists(tv.serialNumber);
        if (exists) {
            return res.status(409).json({ message: 'Tv already exists' });
        }
        const exist = await checkBrandExists(tv.tvBrand);
        if (!exist) {
            return res.status(409).json({ message: 'Tv Brand doesnt exists' });
        }
        const response = await addTvs(tv);
        res.status(200).json({message:"Successfully added",id:response.insertedId});

    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error',error });
    } finally {
        await closeClient();
    }
}