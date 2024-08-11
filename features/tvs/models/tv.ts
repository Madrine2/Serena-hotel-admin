import {Network} from "@/features/tvs/models/network";

export interface TV {
    _id?: string;
    count: string;
    block:string;
    floor: string;
    room: string;
    serialNumber: string;
    tvBrand: string;
    mqttTopic: string;
    debug: boolean;
    network: Network;
    status: boolean;
}
