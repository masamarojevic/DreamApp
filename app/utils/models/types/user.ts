import { Types } from "mongoose";

export interface User {
  email: string;
  password: string;
  notes: noteItem[];
}
export interface noteItem {
  _id: Types.ObjectId;
  title: string;
  description: string;
}
