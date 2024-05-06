import { Types } from "mongoose";

export interface DreamItem {
  _id: Types.ObjectId;
  title: string;
  meaning: string;
}
