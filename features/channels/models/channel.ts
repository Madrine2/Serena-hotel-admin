import { Schedule } from "@/features/channels/models/schedule";

export interface Channel {
  _id: string;
  count: number;
  name: string;
  logo: string;
  input: string;
  status: boolean;
  country: string;
  pg: Schedule;
  category: string[];
}
