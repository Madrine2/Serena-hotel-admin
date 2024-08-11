import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { Facility } from "@/features/facilities/models/facility";
import { checkCount } from "@/utils/checkcount";

export const addFacility = async (facility: Facility) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("facilities");

  const { name, description, image, video, details, pool } = facility;

  // add incremental function
  let currentNumber;
  currentNumber = await checkCount(db, "facilities");

  const newFacility = {
    count: currentNumber,
    name,
    description,
    image,
    video,
    pool,
    details,
    createdAt: new Date(),
  };

  return await collection.insertOne(newFacility);
};

export const getFacilities = async () => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection<Facility>("facilities");

  // Fetch items from the collection
  const items: Facility[] = await collection.find({}).toArray();

  return items;
};

export const editFacility = async (facility: Facility) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("facilities");

  // Ensure the facility has an _id field and convert it to an ObjectId
  if (!facility._id) {
    throw new Error("Facility must have an _id field");
  }

  const { _id, ...updateData } = facility;

  return await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: updateData },
  );
};
export const deleteFacility = async (id: string) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("facilities");
  return await collection.deleteOne({ _id: new ObjectId(id) });
};
