import { User } from "./types/user";
import mongoose, { Schema } from "mongoose";

const emotionSchema = new Schema({
  emotion: {
    type: String,
  },
  color: {
    type: String,
  },
});

const noteItemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
  emotions: [emotionSchema],
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
    username: {
      type: String,
      default: "",
    },
  },
  { strict: true }
);

export const UserModel =
  mongoose.models.UserModel ||
  mongoose.model<User>("UserModel", userSchema, "users");
