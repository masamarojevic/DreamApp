import { Types } from "mongoose";

export interface User {
  email: string;
  password: string;
  notes: noteItem[];
}
export interface noteItem {
  // id: number;
  title: string;
  description: string;
}
