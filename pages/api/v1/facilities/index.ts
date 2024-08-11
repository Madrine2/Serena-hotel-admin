import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {getFacilities} from "@/features/facilities/api/facilityApi";
import {Facility} from "@/features/facilities/models/facility";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const facility:Facility[] = await getFacilities();

        res.status(200).json(facility);
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await closeClient();
    }
}
