import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../utils/db";
import { UserModel } from "../../../utils/models/userModel";
import mongoose from "mongoose";
import { User, noteItem } from "../../../utils/models/types/user";
import jwt from "jsonwebtoken";

export async function DELETE(request: NextRequest) {
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const result = await UserModel.findOneAndUpdate(
      { _id: decoded.userId, "notes._id": noteId },
      { $pull: { notes: { _id: noteId } } },
      { new: true }
    );

    if (!result) {
      return new NextResponse(JSON.stringify({ message: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "Note deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
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
