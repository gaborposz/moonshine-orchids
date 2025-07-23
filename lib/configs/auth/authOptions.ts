import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
// @ts-ignore: No types for bcrypt
import { compare } from "bcrypt";
import { MongoClient } from "mongodb";
import { DB_NAME, USERS_COLLECTION } from "../db/constants";

const uri = process.env.MONGO_DB_CONNECTION_STRING as string;

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }
        const client = new MongoClient(uri);
        await client.connect();
        const usersCollection = client.db(DB_NAME).collection(USERS_COLLECTION);
        const user = await usersCollection.findOne({ email: credentials.email });
        if (!user) {
          await client.close();
          throw new Error("No user found with this email");
        }
        const isValid = await compare(credentials.password, user.password);
        await client.close();
        if (!isValid) {
          throw new Error("Invalid password");
        }
        // Return user object (without password)
        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
  },
};
