import { connectToDatabase } from "@/lib/db";
import { Menus } from "@/features/meals/models/menus";
import { ObjectId } from "mongodb";

export const addMenu = async (category: Menus) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("menus");

  const { name, image, active, details } = category;
  const newMealCategory = {
    name,
    image,
    active,
    details,
    createdAt: new Date(),
  };

  return await collection.insertOne(newMealCategory);
};

export const getMenu = async () => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection<Menus>("menus");

  // Fetch items from the collection
  const items: Menus[] = await collection.find({}).toArray();

  return items;
};

export const editMenu = async (category: Menus) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("menus");

  // Ensure the menu has an _id field and convert it to an ObjectId
  if (!category._id) {
    throw new Error("Category must have an _id field");
  }

  const { _id, ...updateData } = category;

  return await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: updateData },
  );
};
export const deleteMenu = async (id: string) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("menus");
  return await collection.deleteOne({ _id: new ObjectId(id) });
};
