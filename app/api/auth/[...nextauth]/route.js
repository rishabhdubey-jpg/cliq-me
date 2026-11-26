import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const client = await clientPromise;
        const db = client.db("cliqme");
        const users = db.collection("users");

        const existing = await users.findOne({ email: user.email });
        if (!existing) {
          const baseUsername = user.email
            .split("@")[0]
            .toLowerCase()
            .replace(/[^a-z0-9._-]/g, "");

          await users.insertOne({
            username: baseUsername,
            email: user.email,
            name: user.name,
            image: user.image,
            provider: "google",
            createdAt: new Date(),
          });
        }
        return true;
      } catch {
        return false;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };