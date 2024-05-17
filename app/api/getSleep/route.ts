import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "../../utils/models/userModel";
import { dbConnect } from "../../utils/db";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: "No token provided" }),
        { status: 401 }
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

    return new NextResponse(
      JSON.stringify({ sleepPatterns: user.sleepPatern }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching sleep patterns:", error);
    return new NextResponse(
      JSON.stringify({ message: "Failed to fetch sleep patterns", error }),
      { status: 500 }
    );
  }
}
