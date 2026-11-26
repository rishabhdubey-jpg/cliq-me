import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username")?.toLowerCase().trim();
    const email = searchParams.get("email")?.toLowerCase().trim();

    if (!username && !email) {
      return NextResponse.json({ success: true, profiles: [] });
    }

    const client = await clientPromise;
    const db = client.db("cliqme");
    const collection = db.collection("links");

    const conditions = [];
    if (email) conditions.push({ ownerEmail: email });
    if (username) {
      conditions.push({ ownerUsername: username });
      conditions.push({ handle: username });
    }

    const profiles = await collection
      .find({ $or: conditions })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, profiles });
  } catch {
    return NextResponse.json(
      { success: false, profiles: [], message: "Failed to load profiles" },
      { status: 500 }
    );
  }
}