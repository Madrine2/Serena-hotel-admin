import { connectToDatabase } from "@/lib/db";
import { Channel } from "@/features/channels/models/channel";
import { checkCount } from "@/utils/checkcount";
import { ObjectId } from "mongodb";
import { updateFlusonicStream } from "@/features/channels/helpers/updateStreamFlu";
import { deleteFlusonicStream } from "@/features/channels/helpers/deleteStreamFlu";

export const getChannels = async (index: number, limit: number) => {
  const db = await connectToDatabase("iptv");
  const collection = db.collection<Channel>("channels");

  // Fetch the total count of documents
  const total = await collection.countDocuments();

  // Fetch items from the collection with pagination
  const channels = await collection
    .aggregate([
      {
        $lookup: {
          from: "channel_categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $skip: index,
      },
      {
        $limit: limit,
      },
    ])
    .toArray();

  return { channels, total };
};

export const addChannel = async (channel: Channel) => {
  const db = await connectToDatabase("iptv");
  const collection = db.collection("channels");
  const { name, input, logo, country, pg, category } = channel;

  // add incremental function
  let currentNumber;
  currentNumber = await checkCount(db, "channels");
  const newCat = category.map((item: any) => new ObjectId(item));

  const newChannel = {
    count: currentNumber,
    name,
    logo,
    status: true,
    country,
    pg,
    input,
    category: newCat,
  };

  return await collection.insertOne(newChannel);
};

export const editChannel = async (channel: Channel) => {
  const db = await connectToDatabase("iptv");
  const collection = db.collection("channels");

  if (!channel._id) {
    throw new Error("Channel must have an _id field");
  }

  // Retrieve the current document to compare input values
  const currentChannel = await collection.findOne({
    _id: new ObjectId(channel._id),
  });
  if (!currentChannel) {
    throw new Error("Channel not found");
  }

  const { _id, input, ...updateData } = channel;
  const previousInput = currentChannel.input;

  // Update the document in MongoDB
  const result = await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: { ...updateData, input } }, // Ensure input is included in the update data
  );

  if (input !== previousInput) {
    await updateFlusonicStream(_id, input); // Pass the _id and new input value to Flusonic update function
  }

  return result;
};

export const deleteChannel = async (id: string) => {
  const db = await connectToDatabase("iptv");
  const collection = db.collection("channels");

  // Delete the channel from MongoDB
  const result = await collection.deleteOne({ _id: new ObjectId(id) });

  // If the channel was deleted in MongoDB, delete the stream in Flusonic
  if (result.deletedCount > 0) {
    await deleteFlusonicStream(id);
  }

  return result;
};

export async function updateChannelUrl(channelId: string, url: string) {
  const db = await connectToDatabase("iptv");
  const collection = db.collection("channels");

  return await collection.updateOne(
    { _id: new ObjectId(channelId) },
    { $set: { url } },
  );
}
