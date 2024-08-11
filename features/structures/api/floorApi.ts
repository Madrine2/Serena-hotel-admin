import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { Floors } from "@/features/structures/models/floors";

export const addFloor = async (floor: Floors) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("floors");
  const blockCollection = db.collection("blocks");

  const { name, block } = floor;

  const blockDoc = await blockCollection.findOne({ name: block });
  if (!blockDoc) {
    throw new Error("Block not found");
  }
  const newFloor = {
    name,
    totalRooms: 0,
    block: blockDoc._id,
    createdAt: new Date(),
  };

  return await collection.insertOne(newFloor);
};
export const getFloors = async () => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection<Floors>("floors");

  // Fetch submenus with embedded menu details
  return await collection
    .aggregate([
      {
        $lookup: {
          from: "blocks",
          localField: "block",
          foreignField: "_id",
          as: "block",
        },
      },
    ])
    .toArray();
};
export const editFloors = async (floor: Floors) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("floors");

  // Ensure the floor has an _id field and convert it to an ObjectId
  if (!floor._id) {
    throw new Error("Floor must have an _id field");
  }

  const { _id, ...updateData } = floor;

  return await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: updateData },
  );
};

export const deleteFloor = async (floorId: string) => {
  const db = await connectToDatabase("hotel");
  const floorsCollection = db.collection("floors");

  // Find the floor to get the block ID
  const floor = await floorsCollection.findOne({ _id: new ObjectId(floorId) });
  if (!floor) {
    return { deletedCount: 0, blockId: null }; // Floor not found
  }

  const blockId = floor.block; // Assuming `block` field is an ObjectId

  // Delete the floor
  const result = await floorsCollection.deleteOne({
    _id: new ObjectId(floorId),
  });

  return { deletedCount: result.deletedCount, blockId };
};
