import {ChannelProgram} from "@/features/channels/models/program";

export interface Schedule {
    mon: ChannelProgram[];
    tue: ChannelProgram[];
    wed: ChannelProgram[];
    thur: ChannelProgram[];
    fri: ChannelProgram[];
    sat: ChannelProgram[];
    sun: ChannelProgram[];
}