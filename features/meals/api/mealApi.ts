import { connectToDatabase } from "@/lib/db";
import { Meal } from "@/features/meals/models/meal";
import { ObjectId } from "mongodb";
import { checkCount } from "@/utils/checkcount";

export const addMeal = async (meal: Meal) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("meals");
  const subCollection = db.collection("sub_menus");
  const menuCollection = db.collection("menus");

  const {
    name,
    price,
    description,
    status,
    subMenu,
    ingredients,
    menu,
    totalItems,
    image,
  } = meal;

  const menuDoc = await menuCollection.findOne({ name: menu });
  if (!menuDoc) {
    throw new Error("Menu not found");
  }

  const subDoc = await subCollection.findOne({ "data.name": subMenu });
  if (!subDoc) {
    throw new Error("SubMenu not found");
  }

  let currentNumber;
  currentNumber = await checkCount(db, "meals");
  const newMeal = {
    count: currentNumber,
    name,
    image,
    ingredients,
    menu: menuDoc._id,
    totalItems,
    description,
    price,
    status,
    subMenu: subDoc._id,
    createdAt: new Date(),
  };

  return await collection.insertOne(newMeal);
};

export const getMeals = async () => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection<Meal>("meals");

  return await collection
    .aggregate([
      {
        $lookup: {
          from: "menus",
          localField: "menu",
          foreignField: "_id",
          as: "menu",
        },
      },
      {
        $lookup: {
          from: "sub_menus",
          localField: "subMenu",
          foreignField: "_id",
          as: "subMenu",
        },
      },
    ])
    .toArray();
};

export const editMeal = async (meal: Meal) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("meals");

  // Ensure the meal has an _id field and convert it to an ObjectId
  if (!meal._id) {
    throw new Error("Meal must have an _id field");
  }

  const { _id, ...updateData } = meal;

  return await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: updateData },
  );
};

export const deleteMeal = async (id: string) => {
  const db = await connectToDatabase("hotel");
  const mealsCollection = db.collection("meals");
  const subMenusCollection = db.collection("sub_menus");

  const mealId = new ObjectId(id);

  // Delete the meal from the meals collection
  const deleteResult = await mealsCollection.deleteOne({ _id: mealId });

  if (deleteResult.deletedCount === 0) {
    throw new Error("Meal not found");
  }

  // Remove the meal ID from the corresponding sub-menu
  await subMenusCollection.updateMany(
    { "data.data": mealId },
    { $pull: { "data.$[].data": mealId as any } },
  );

  return deleteResult;
};
