import { Types } from "mongoose";

export interface User {
  email: string;
  password: string;
  notes: noteItem[];
  username?: string;
}
export interface noteItem {
  _id: Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  emotions: Emotions[];
}

export interface Emotions {
  emotion: string;
  color: string;
}
