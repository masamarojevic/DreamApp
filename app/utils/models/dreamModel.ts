import { DreamItem } from "./types/dream";
import mongoose, { Schema } from "mongoose";

const dreamItemSchema = new Schema(
  {
    title: {
      type: String,
    },
    meaning: {
      type: String,
    },
  },
  { collection: "Dream_meanings" }
);

export const DreamModel =
  mongoose.models.DreamModel ||
  mongoose.model<DreamItem>("DreamModel", dreamItemSchema, "Dream_meanings");
console.log(DreamModel.collection.name);
