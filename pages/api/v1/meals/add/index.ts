import {NextApiRequest, NextApiResponse} from "next";
import {closeClient} from "@/lib/db";
import {Meal} from "@/features/meals/models/meal";
import {addMeal} from "@/features/meals/api/mealApi";
import {checkMealExists} from "@/features/meals/helpers/checkMealExists";
import {checkMenuExists} from "@/features/meals/helpers/checkMenuExists";
import {checkSubMenuExists} from "@/features/meals/helpers/checkSubMenuExists";
import {addMealToSubMenuData} from "@/features/meals/helpers/addMealToSubMenuData";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const meal:Meal = req.body;
        if (!meal.name|| !meal.price|| !meal.description|| !meal.status|| !meal.subMenu||
            !meal.ingredients || !meal.menu || !meal.totalItems || !meal.image) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const exist = await checkMenuExists(meal.menu);
        if (!exist) {
            return res.status(409).json({ message: 'Meal menu doesnt exists' });
        }
        const subExist = await checkSubMenuExists(meal.subMenu);
        if (!subExist) {
            return res.status(409).json({ message: 'Meal submenu doesnt exists' });
        }
        const mealExist = await checkMealExists(meal.name);
        if (mealExist) {
            return res.status(409).json({ message: 'Meal already exists' });
        }

        const response = await addMeal(meal);
        await addMealToSubMenuData(meal.subMenu, response.insertedId);

        res.status(200).json({message:"Successfully added",id:response.insertedId});


    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error',error });
    } finally {
        await closeClient();
    }
}