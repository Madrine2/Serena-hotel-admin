import {WifiNetwork} from "@/features/tvs/models/wifi";
import {EthernetNetwork} from "@/features/tvs/models/ethernet";

export interface Network {
    id: string;
    active: 'ethernet' | 'wifi';
    ethernet?: EthernetNetwork;
    wifi?: WifiNetwork;
}