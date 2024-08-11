import { NextApiRequest, NextApiResponse } from "next";
import { closeClient } from "@/lib/db";
import { getChannels } from "@/features/channels/api/channelsApi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Parse pagination parameters from the query string
    const index = parseInt(req.query.index as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    const { channels, total } = await getChannels(index, limit);

    res.status(200).json({ channels, total });
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await closeClient();
  }
}
