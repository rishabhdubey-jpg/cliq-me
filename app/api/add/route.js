import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  const body = await request.json();

  const client = await clientPromise;
  const db = client.db("cliqme");
  const collection = db.collection("links");

  const cleanHandle = body.handle?.toLowerCase().trim();
  const doc = await collection.findOne({ handle: cleanHandle });

  if (doc) {
    return Response.json({
      success: false,
      error: true,
      message: "This CliqMe handle already exists!",
      result: null,
    });
  }

  const newDoc = {
    handle: cleanHandle,
    links: body.links,
    pic: body.pic,
    desc: body.desc,
    ownerUsername: body.ownerUsername?.toLowerCase().trim() || null,
    ownerEmail: body.ownerEmail?.toLowerCase().trim() || null,
    createdAt: new Date(),
  };

  const result = await collection.insertOne(newDoc);

  return Response.json({
    success: true,
    error: false,
    message: "Your CliqMe has been generated!",
    result,
  });
}