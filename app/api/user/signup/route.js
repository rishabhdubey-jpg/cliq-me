import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("cliqme");
    const users = db.collection("users");

    const cleanUsername = username.toLowerCase().trim().replace(/[^a-z0-9._-]/g, "");
    const cleanEmail = email ? email.toLowerCase().trim() : null;

    const query = cleanEmail
      ? { $or: [{ username: cleanUsername }, { email: cleanEmail }] }
      : { username: cleanUsername };

    const existing = await users.findOne(query);
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Username or email is already taken." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      username: cleanUsername,
      ...(cleanEmail && { email: cleanEmail }),
      password: hashedPassword,
      createdAt: new Date(),
    });

    const token = jwt.sign(
      { userId: result.insertedId.toString(), username: cleanUsername, email: cleanEmail },
      process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully!",
      user: { username: cleanUsername, email: cleanEmail },
    });

    response.cookies.set("cliqme_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error during signup." },
      { status: 500 }
    );
  }
}