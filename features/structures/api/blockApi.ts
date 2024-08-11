import { connectToDatabase } from "@/lib/db";
import { Blocks } from "@/features/structures/models/blocks";
import { ObjectId } from "mongodb";

export const addBlock = async (block: Blocks) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("blocks");

  const { name } = block;

  const newBlock = {
    name,
    totalRooms: 0,
    totalFloors: 0,
    createdAt: new Date(),
  };

  return await collection.insertOne(newBlock);
};
export const getBlocks = async () => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection<Blocks>("blocks");

  // Fetch items from the collection
  const items: Blocks[] = await collection.find({}).toArray();

  return items;
};
export const editBlock = async (block: Blocks) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("blocks");

  // Ensure the block has an _id field and convert it to an ObjectId
  if (!block._id) {
    throw new Error("Block must have an _id field");
  }

  const { _id, ...updateData } = block;

  return await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: updateData },
  );
};

export const deleteBlock = async (id: string) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("blocks");
  return await collection.deleteOne({ _id: new ObjectId(id) });
};
