import {OrderDetails} from "@/features/meals/models/orderDetails";

export interface Order {
    _id: string;
    count: number;
    date: string;
    tvId: string;
    orders: Order[];
    state: OrderDetails[];
    totalAmount: number;
}