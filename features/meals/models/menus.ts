import {Details} from "@/features/meals/models/menu_details";

export interface Menus {
    _id:string;
    name: string;
    image: string;
    active: boolean;
    details:Details[];
}
