import {Details} from "@/features/facilities/models/details";
export interface Facility {
    _id: string;
    count:string;
    name: string;
    description: string;
    image: string;
    video: string;
    pool: string;
    createdAt: Date;
    details: Details;
}