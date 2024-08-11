import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {getTvs} from "@/features/tvs/api/tvApi";
import {TV} from "@/features/tvs/models/tv";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const tv:TV[] = await getTvs();

        res.status(200).json(tv);
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await closeClient();
    }
}
