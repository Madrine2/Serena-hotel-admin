import {connectToDatabase} from "@/lib/db";
import {ObjectId} from "mongodb";
import {Rooms} from "@/features/structures/models/rooms";

export const addRoom= async (room:Rooms)=>{
    const db = await connectToDatabase("hotel");
    const collection = db.collection('rooms');
    const floorCollection = db.collection('floors');

    const {floor,type,number} = room;

    const floorDoc = await floorCollection.findOne({ name: floor });
    if (!floorDoc) {
        throw new Error('Room not found');
    }
    const newRoom={
        number,
        floor:floorDoc._id,
        type,
        createdAt: new Date(),
    }

    return await collection.insertOne(newRoom);

}
export const getRooms = async ()=>{
    const db = await connectToDatabase("hotel");
    const collection = db.collection<Rooms>('rooms');

    return await collection.aggregate([
        {
            $lookup: {
                from: "floors",
                localField: "floor",
                foreignField: "_id",
                as: "floor"
            }
        },

    ]).toArray();
};

export const editRooms = async (room: Rooms) => {
    const db = await connectToDatabase("hotel");
    const collection = db.collection('rooms');

    if (!room._id) {
        throw new Error('Room must have an _id field');
    }

    const { _id, ...updateData } = room;


    return await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updateData }
    );
};

export const deleteRoom = async (roomId: string) => {
    const db = await connectToDatabase("hotel");
    const roomsCollection = db.collection("rooms");
    const floorsCollection = db.collection("floors");
    const blocksCollection = db.collection("blocks");

    // Find the room to get the floor ID
    const room = await roomsCollection.findOne({ _id: new ObjectId(roomId) });
    if (!room) {
        return { deletedCount: 0, floorId: null, blockId: null }; // Room not found
    }

    const floorId = room.floor;
    const floor = await floorsCollection.findOne({ _id: new ObjectId(floorId) });
    if (!floor) {
        return { deletedCount: 0, floorId: null, blockId: null }; // Floor not found
    }

    const blockId = floor.block;

    // Delete the room
    const result = await roomsCollection.deleteOne({ _id: new ObjectId(roomId) });

    if (result.deletedCount > 0) {
        // Decrement totalRooms in the floors collection
        await floorsCollection.updateOne(
            { _id: new ObjectId(floorId) },
            { $inc: { totalRooms: -1 } }
        );

        // Decrement totalRooms in the blocks collection
        await blocksCollection.updateOne(
            { _id: new ObjectId(blockId) },
            { $inc: { totalRooms: -1 } }
        );
    }

    return { deletedCount: result.deletedCount, floorId, blockId };
};