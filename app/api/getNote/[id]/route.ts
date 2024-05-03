import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../utils/db";
import { UserModel } from "../../../utils/models/userModel";
import mongoose from "mongoose";
import { User, noteItem } from "../../../utils/models/types/user";

export async function GET(request: NextRequest) {
  await dbConnect();

  //this code runs on the server and request is an instance of nextrequest that
  //is a part of next-server
  const urlPath = request.nextUrl.pathname;
  const noteId = urlPath.split("/").pop();

  console.log("Requested Note ID:", noteId);

  try {
    if (!noteId) {
      return new NextResponse(
        JSON.stringify({ message: "Missing note ID parameter" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const user: User | null = await UserModel.findOne({
      "notes._id": new mongoose.Types.ObjectId(noteId),
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Find the note within the user's notes
    const note: noteItem | undefined = user.notes.find(
      (note) => note._id.toString() === noteId
    );

    if (!note) {
      return new NextResponse(JSON.stringify({ message: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new NextResponse(JSON.stringify({ note }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching note:", error);
    return new NextResponse(
      JSON.stringify({ message: "Server error", error }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
