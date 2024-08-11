import {Data} from "@/features/meals/models/sub_menu_details";

export interface SubMenus {
    _id: string;
    count:number;
    menu:string;
    data:Data[];
}