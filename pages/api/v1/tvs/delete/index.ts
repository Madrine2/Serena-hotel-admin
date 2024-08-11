import { NextApiRequest, NextApiResponse } from 'next';
import {ParsedUrlQuery} from "node:querystring";
import {deleteTv} from "@/features/tvs/api/tvApi";
import {closeClient} from "@/lib/db";

interface QueryParams extends ParsedUrlQuery {
    id: string;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE'){
        try {
            const { id } = req.query as QueryParams;

            if (!id) {
                return res.status(400).json({ error: 'TV ID is required' });
            }

            const result = await deleteTv(id);

            if (result.deletedCount === 0) {
                res.status(404).json({ error: 'TV not found' });
            } else {
                res.status(200).json({ message: 'Tv deleted successfully', result });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete TV',err:error });
        }finally{
            await  closeClient();
        }
    }else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}