import { connectToDatabase } from "@/lib/db";
import { SubMenus } from "@/features/meals/models/sub_menus";
import { ObjectId } from "mongodb";
import { checkCount } from "@/utils/checkcount";

export const addSubMenu = async (subMenus: SubMenus) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("sub_menus");
  const menuCollection = db.collection("menus");

  let currentNumber;
  currentNumber = await checkCount(db, "sub_menus");

  const { menu, data } = subMenus;

  // Fetch the menu ID from the menus collection
  const menuDoc = await menuCollection.findOne({ name: menu });
  if (!menuDoc) {
    throw new Error("Menu not found");
  }

  // Create the new submenu object
  const newSubMenu = {
    count: currentNumber,
    menu: menuDoc._id,
    data,
    createdAt: new Date(),
  };

  return await collection.insertOne(newSubMenu);
};

export const getSubMenus = async () => {
  const db = await connectToDatabase("hotel");
  const subMenusCollection = db.collection<SubMenus>("sub_menus");

  return await subMenusCollection
    .aggregate([
      {
        $lookup: {
          from: "menus",
          localField: "menu",
          foreignField: "_id",
          as: "menu",
        },
      },
      // {
      //     $lookup: {
      //         from: "meals",
      //         localField: "data.data",
      //         foreignField: "_id",
      //         as: "mealData"
      //     }
      //
      // }
    ])
    .toArray();
};

export const editSubMenu = async (category: SubMenus) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("sub_menus");

  // Ensure the menu has an _id field and convert it to an ObjectId
  if (!category._id) {
    throw new Error("SubMenu must have an _id field");
  }

  const { _id, ...updateData } = category;

  return await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: updateData },
  );
};

export const deleteSubMenu = async (id: string) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("sub_menus");
  return await collection.deleteOne({ _id: new ObjectId(id) });
};
