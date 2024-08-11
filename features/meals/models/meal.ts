import {Ingredient} from "@/features/meals/models/ingredient";

export interface Meal {
    _id: string;
    name: string;
    price: string;
    image: string;
    ingredients: Ingredient[];
    menu: string;
    subMenu: string;
    status: boolean;
    totalItems: number;
    count: number;
    description: string;
}