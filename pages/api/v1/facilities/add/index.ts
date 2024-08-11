import {closeClient, connectToDatabase} from "@/lib/db";
import {NextApiRequest, NextApiResponse} from "next";
import {Facility} from "@/features/facilities/models/facility";
import {addFacility} from "@/features/facilities/api/facilityApi";
import {checkFacilityExists} from "@/features/facilities/helpers/checkFacilityExists";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const facility:Facility = req.body;
        if (!facility.name || !facility.image || !facility.video || !facility.description
            || !facility.pool || !facility.details){
            return res.status(400).json({ message: 'All fields are required' });
        }
        const db = await connectToDatabase("hotel");
        const collection = db.collection('facilities');


        const exists = await checkFacilityExists(facility.name);
        if (exists) {
            return res.status(409).json({ message: 'Facility already exists' });
        }

        //Check if the facilities are over 4
        const facilityCount = await collection.countDocuments();
        if (facilityCount >= 4) {
            return res.status(403).json({ message: 'Cannot add more than 4 facilities' });
        }
        //add facility
        const response = await addFacility(facility);
        res.status(200).json({message:"Successfully added",id:response.insertedId});

    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error',error });
    } finally {
        await closeClient();
    }
}

