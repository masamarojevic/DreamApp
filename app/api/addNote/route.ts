import { NextRequest, NextResponse } from "next/server";
import { User } from "../../utils/models/types/user";
import { UserModel } from "../../utils/models/userModel";
import { dbConnect } from "../../utils/db";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { title, description, token } = await request.json();

    if (!title || !description) {
      return new NextResponse(
        JSON.stringify({
          message: "You need to fill in the title and description",
        }),
        { status: 400 }
      );
    }

    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: "Authentication token is missing" }),
        { status: 401 }
      );
    }
    const jwtSecret = process.env.JWT_SECRET as string;
    if (!jwtSecret) {
      throw new Error("jwt not defined");
    }

    const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload;
    if (!decoded.userId) {
      return new NextResponse(JSON.stringify({ message: "Invalid token" }), {
        status: 403,
      });
    }

    // Find user by id
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const newNote = {
      title,
      description,
      date: new Date(),
    };
    user.notes.push(newNote);
    console.log(newNote);

    await user.save();
    return new NextResponse(
      JSON.stringify({ message: "Note added successfully", notes: user.notes }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Error adding note", error }),
      { status: 500 }
    );
  }
}
