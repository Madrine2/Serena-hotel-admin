import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { TV } from "@/features/tvs/models/tv";
import { checkCount } from "@/utils/checkcount";

export const getTvs = async () => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection<TV>("tvs");

  // Fetch items from the collection
  const items: TV[] = await collection.find({}).toArray();

  return items;
};

export const addTvs = async (tv: TV) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("tvs");
  const {
    block,
    floor,
    room,
    serialNumber,
    tvBrand,
    network,
    debug,
    mqttTopic,
  } = tv;

  // add incremental function
  let currentNumber;
  currentNumber = await checkCount(db, "tvs");

  const newTv = {
    count: currentNumber,
    block,
    floor,
    room,
    serialNumber,
    tvBrand,
    network,
    mqttTopic,
    debug,
    status: true,
    createdAt: new Date(),
  };

  return await collection.insertOne(newTv);
};

export const editTv = async (tv: TV) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("tvs");

  // Ensure the TV has an _id field and convert it to an ObjectId
  if (!tv._id) {
    throw new Error("TV must have an _id field");
  }

  const { _id, ...updateData } = tv;

  return await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: updateData },
  );
};

export const deleteTv = async (id: string) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("tvs");
  return await collection.deleteOne({ _id: new ObjectId(id) });
};
