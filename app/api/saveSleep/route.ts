import { NextRequest, NextResponse } from "next/server";
import { User } from "../../utils/models/types/user";
import { UserModel } from "../../utils/models/userModel";
import { dbConnect } from "../../utils/db";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  userId: string; // Add other expected properties here
}
export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const authorizationHeader = request.headers.get("authorization");

    if (!authorizationHeader) {
      return new NextResponse(
        JSON.stringify({ message: "Authentication token is missing" }),
        { status: 401 }
      );
    }

    const token = authorizationHeader.split(" ")[1];

    const { quality, duration } = await request.json();

    if (!quality || !duration) {
      return new NextResponse(
        JSON.stringify({
          message: "Time was not mesaured",
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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as CustomJwtPayload;
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

    const newSleep = {
      quality,
      duration,
    };
    user.sleepPatern.push(newSleep);
    console.log(newSleep);

    await user.save();
    return new NextResponse(
      JSON.stringify({
        message: "sleep added successfully",
        user: user.sleepPatern,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error adding note", error }),
      { status: 500 }
    );
  }
}
