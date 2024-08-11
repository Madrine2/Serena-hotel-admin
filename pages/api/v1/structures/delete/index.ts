import { NextApiRequest, NextApiResponse } from 'next';
import { deleteChannel } from "@/features/channels/api/channelsApi";
import { closeClient } from "@/lib/db";
import { ParsedUrlQuery } from "node:querystring";

interface QueryParams extends ParsedUrlQuery {
    id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { id } = req.query as QueryParams;

        if (!id) {
            return res.status(400).json({ message: 'Channel ID is required' });
        }

        const result = await deleteChannel(id);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        res.status(200).json({ message: 'Channel deleted successfully', result });
    } catch (error) {
        console.error('Error deleting channel:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await closeClient();
    }
}
