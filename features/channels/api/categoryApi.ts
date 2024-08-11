import {Category} from "@/features/channels/models/category";
import {connectToDatabase} from "@/lib/db";
import {ObjectId} from "mongodb";

export const addCategoryChannel= async (category:Category)=>{
    const db = await connectToDatabase("iptv");
    const collection = db.collection('channel_categories');

    const {image, type} = category;
    const newChannelCategory={
        image,
        type,
        createdAt: new Date(),
    }

    return await collection.insertOne(newChannelCategory);

}

export const getCategoryChannels = async (): Promise<Category[]> => {
    const db = await connectToDatabase("iptv");
    const collection = db.collection<Category>('categories');

    // Fetch items from the collection and sort them directly
    return (await collection.find({}).toArray()).sort((a, b) => {
        if (a.type === 'all') return -1;
        if (b.type === 'all') return 1;
        if (a.type === 'local') return -1;
        if (b.type === 'local') return 1;
        return 0; // Default sort order for the rest
    });
}


export const editCategoryChannel = async (category:Category) => {
    const db = await connectToDatabase("iptv");
    const collection = db.collection('categories');

    // Ensure the channel has an _id field and convert it to an ObjectId
    if (!category._id) {
        throw new Error('Category Type must have an _id field');
    }

    const { _id, ...updateData } = category;

    return  await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updateData }
    );
}
export const deleteCategoryChannel = async (id:string) => {
    const db = await connectToDatabase("iptv");
    const collection = db.collection('categories');
    return  await collection.deleteOne({ _id: new ObjectId(id) });
}