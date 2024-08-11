import { NextApiRequest, NextApiResponse } from "next";
import { editChannel } from "@/features/channels/api/channelsApi";
import { closeClient } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id } = req.query;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Invalid channel ID" });
    }

    const channel = { _id: id, ...req.body };

    const result = await editChannel(channel);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.status(200).json({ message: "Channel updated successfully", result });
  } catch (error) {
    console.error("Error updating channel:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await closeClient();
  }
}
