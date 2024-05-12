import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../utils/db";
import { json } from "stream/consumers";
import { User } from "../../utils/models/types/user";
import { UserModel } from "../../utils/models/userModel";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: "Token is required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    const userId = decoded.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new NextResponse(JSON.stringify({ user }));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error getting user info", error },
      { status: 500 }
    );
  }
}
