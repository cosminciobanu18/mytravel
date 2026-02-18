import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import DBConnect from "@/lib/db";
import User from "@/lib/models/user";
import Tag from "@/lib/models/tag";
import { Result } from "postcss";

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
        { upsert: true, new: true, includeResultMetadata: true },
      );

      if (!userFromDB.lastErrorObject.updatedExisting)
        await Tag.create({
          name: "Visited",
          color: "green",
          owner: userFromDB.value._id,
        });

      user.id = userFromDB.value._id.toString();
      console.log("signIn", { user });
      console.log("-------------------");
      console.log({ amCreat: !userFromDB.lastErrorObject.updatedExisting });
      console.log("----------------------------------------------");
      return true;
    },

    async jwt({ token, user }) {
      console.log("jwt", { token }, { user });
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      await DBConnect();
      const dbUser = await User.findOne({ email: session.user.email });
      console.log("Session", { session }, { token });
      session.user.id = token.id;
      session.user.image = dbUser.avatar;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};
const handler = NextAuth(options);

export { handler as GET, handler as POST };
