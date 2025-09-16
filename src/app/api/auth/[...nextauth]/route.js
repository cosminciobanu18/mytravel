import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import DBConnect from "@/lib/db";
import User from "@/lib/models/user";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const options = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!profile?.email) {
        throw new Error("No profile");
      }

      await DBConnect();
      const userFromDB = await User.findOneAndUpdate(
        { email: profile?.email },
        {
          $setOnInsert: {
            email: profile.email,
            name: profile.name,
            avatar: profile.picture,
            createdAt: new Date(),
          },
        },
        { upsert: true, new: true }
      );

      user.id = userFromDB._id.toString();
      return true;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};
const handler = NextAuth(options);

export { handler as GET, handler as POST };
