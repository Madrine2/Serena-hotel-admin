import {Collection, Db} from "mongodb";

export const checkCount =async (db: Db, collectionName: string): Promise<number> => {
    const collection: Collection = db.collection(collectionName);
    const highestCountDoc = await collection.find().sort({ count: -1 }).limit(1).toArray();

    if (highestCountDoc.length === 0) {
        return 1;
    }
    return  highestCountDoc[0].count + 1;
}

