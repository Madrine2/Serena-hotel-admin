import {connectToDatabase} from "@/lib/db";
import {SubMenus} from "@/features/meals/models/sub_menus";
import {ObjectId} from "mongodb";

export async function addMealToSubMenuData(mealName: string, mealId: ObjectId) {
    const db = await connectToDatabase("hotel");
    const subMenuCollection = db.collection<SubMenus>('sub_menus');

    const result = await subMenuCollection.updateOne(
        { "data.name": mealName },
        { $push: { "data.$.data": mealId } }
    );

    if (result.matchedCount === 0) {
        throw new Error('SubMenu or Meal not found');
    }

    return result;
}