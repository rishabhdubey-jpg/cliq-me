import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: "Please enter your credentials." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("cliqme");
    const users = db.collection("users");

    const cleanId = identifier.toLowerCase().trim();
    const user = await users.findOne({
      $or: [{ email: cleanId }, { username: cleanId }],
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, message: "Invalid username/email or password." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid username/email or password." },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username, email: user.email || null },
      process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Welcome back!",
      user: { username: user.username, email: user.email || null },
    });

    response.cookies.set("cliqme_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error during login." },
      { status: 500 }
    );
  }
}