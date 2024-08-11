import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { Order } from "@/features/meals/models/order";
import { checkCount } from "@/utils/checkcount";

export const addOrder = async (order: Order) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("orders");

  let currentNumber;
  currentNumber = await checkCount(db, "orders");

  const { orders, state, tvId, totalAmount } = order;

  // const orderDoc = await menuCollection.findOne({ "orders.menuID": order });

  const newOrder = {
    count: currentNumber,
    orders,
    date: new Date(),
    state,
    tvId,
    totalAmount,
  };

  return await collection.insertOne(newOrder);
};

export const getOrders = async () => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection<Order>("orders");

  // Fetch items from the collection
  const items: Order[] = await collection.find({}).toArray();

  return items;
};

export const editOrder = async (order: Order) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("orders");

  // Ensure the meal has an _id field and convert it to an ObjectId
  if (!order._id) {
    throw new Error("Order must have an _id field");
  }

  const { _id, ...updateData } = order;

  return await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: updateData },
  );
};
export const deleteOrder = async (id: string) => {
  const db = await connectToDatabase("hotel");
  const collection = db.collection("orders");
  return await collection.deleteOne({ _id: new ObjectId(id) });
};
