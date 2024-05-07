import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../utils/db";
import { UserModel } from "../../../utils/models/userModel";
import mongoose from "mongoose";
import { User, noteItem } from "../../../utils/models/types/user";
import jwt from "jsonwebtoken";

export async function PUT(request: NextRequest) {
  await dbConnect();
  const urlPath = request.nextUrl.pathname;
  const noteId = urlPath.split("/").pop();

  console.log("Requested Note ID:", noteId);

  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: "Token is required" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!noteId) {
      return new NextResponse(
        JSON.stringify({ message: "Missing note ID parameter" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const { title, description } = await request.json();
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    const user = await UserModel.findOne({
      _id: decoded.userId,
      "notes._id": noteId,
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const note = user.notes.id(noteId);

    if (!note) {
      return new NextResponse(JSON.stringify({ message: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    note.title = title;
    note.description = description;

    await user.save();

    return new NextResponse(JSON.stringify({ note }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({
        message: "Error updating note",
        error,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
//  // Verify the token and get userId
//  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
//     userId: string;
//   };
//   const userId = decoded.userId;
//   const { noteItem } = await request.json();
//   const updateUserNotes = await UserModel.findByIdAndUpdate(
//     userId,
//     { noteItem },
//     { new: true }
//   );
//   if (!updateUserNotes) {
//     return new NextResponse(JSON.stringify({ message: "User not found" }), {
//       status: 400,
//       headers: { "Conetnt-Type": "application/json" },
//     });
//   }
//   return new NextResponse(
//     JSON.stringify({
//       message: "Notes updated",
//       user: updateUserNotes,
//     }),
//     { status: 200, headers: { "Content-Type": "application/json" } }
//   );
