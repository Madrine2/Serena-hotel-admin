import { NextApiRequest, NextApiResponse } from 'next';
import {ParsedUrlQuery} from "node:querystring";
import {closeClient} from "@/lib/db";
import {deleteFacility} from "@/features/facilities/api/facilityApi";

interface QueryParams extends ParsedUrlQuery {
    id: string;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE'){
        try {
            const { id } = req.query as QueryParams;

            if (!id) {
                return res.status(400).json({ error: 'Facility ID is required' });
            }

            const result = await deleteFacility(id);

            if (result.deletedCount === 0) {
                res.status(404).json({ error: 'Facility not found' });
            } else {
                res.status(200).json({ message: 'Facility deleted successfully', result });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete Facility',err:error });
        }finally{
            await  closeClient();
        }
    }else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}