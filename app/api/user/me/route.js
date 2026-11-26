import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  const token = request.cookies.get("cliqme_token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET
    );
    return NextResponse.json({
      authenticated: true,
      user: { username: decoded.username, email: decoded.email },
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}