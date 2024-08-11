import {
  addChannel,
  updateChannelUrl,
} from "@/features/channels/api/channelsApi";
import { Channel } from "@/features/channels/models/channel";
import { NextApiRequest, NextApiResponse } from "next";
import { checkChannelExists } from "@/features/channels/helpers/checkChannelExists";
import { addStream } from "@/features/channels/helpers/addStreamToFlu";
import { closeClient } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const channel: Channel = req.body;
    if (
      !channel.name ||
      !channel.logo ||
      !channel.input ||
      !channel.country ||
      !channel.pg ||
      !channel.input ||
      !Array.isArray(channel.category) ||
      channel.category.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Invalid data format or missing fields" });
    }

    const exists = await checkChannelExists(channel.name);
    if (exists) {
      return res.status(409).json({ message: "Channel already exists" });
    }

    const addChannelResponse = await addChannel(channel);
    const insertedId = addChannelResponse.insertedId;

    const streamResponse = await addStream(
      insertedId.toString(),
      channel.input,
    );

    const url = `http://172.40.1.223:1831/${insertedId}/video.m3u8`;

    // Store the generated URL in the database
    await updateChannelUrl(insertedId.toString(), url);

    res.status(200).json({
      message: "Successfully added channel and stream",
      channelId: insertedId,
      streamResponse,
      url, // Include the generated URL in the response
    });
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    res.status(500).json({ message: "Internal Server Error", error });
  } finally {
    await closeClient();
  }
}
