import { Types } from "mongoose";

export interface User {
  email: string;
  password: string;
  notes: noteItem[];
  username?: string;
  sleepPatern: Sleep[];
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

export interface Sleep {
  quality: "bad" | "avarage" | "good"; //enum
  duration: Number;
  time: Date;
  color: string;
}

// export interface Quality {
//   bad: String;
//   avarage: String;
//   good: String;
// }
