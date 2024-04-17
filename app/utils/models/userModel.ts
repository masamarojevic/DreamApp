import { User } from "./types/user";
import mongoose, { Schema } from "mongoose";

const noteItemSchema = new Schema({
  // id: {
  //   type: Number,
  //   required: true,
  // },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    notes: {
      type: [noteItemSchema],
      default: [],
    },
  },
  { strict: true }
);

export const UserModel =
  mongoose.models.UserModel ||
  mongoose.model<User>("UserModel", userSchema, "users");
