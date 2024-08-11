import { NextApiRequest, NextApiResponse } from 'next';
import {closeClient} from "@/lib/db";
import {ParsedUrlQuery} from "node:querystring";
import {deleteMeal} from "@/features/meals/api/mealApi";

interface QueryParams extends ParsedUrlQuery {
    id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE'){
        try {
            const { id } = req.query as QueryParams;

            if (!id) {
                return res.status(400).json({ error: 'Meal ID is required' });
            }

            const result = await deleteMeal(id);

            if (result.deletedCount === 0) {
                res.status(404).json({ error: 'Meal not found' });
            } else {
                res.status(200).json({ message: 'Meal deleted successfully', result });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete Meal',err:error });
        }finally{
            await  closeClient();
        }
    }else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}