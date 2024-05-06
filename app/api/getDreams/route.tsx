import { DreamModel } from "../../utils/models/dreamModel";
import { dbConnect } from "../../utils/db";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

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

    jwt.verify(token, process.env.JWT_SECRET as string);

    //const dreams = await DreamModel.find({});
    const dreams = await DreamModel.find({});
    console.log("Fetched dreams count:", dreams.length);
    console.log("Fetched dreams detail:", dreams);

    console.log(DreamModel.collection.name);
    if (dreams.length === 0) {
      console.log("No dreams found in the database.");
    }

    return new NextResponse(JSON.stringify({ dreams }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError) {
      return new NextResponse(JSON.stringify({ message: "Invalid token" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new NextResponse(
      JSON.stringify({ message: "Error retrieving notes" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
