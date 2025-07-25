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
        name: { label: "Name", type: "text" },
        action: { label: "Action", type: "text" } // 'login' or 'register'
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing email or password");
          }

          const client = new MongoClient(uri);
          await client.connect();
          const usersCollection = client.db(DB_NAME).collection(USERS_COLLECTION);

          if (credentials.action === 'register') {
            // Registration logic
            const existingUser = await usersCollection.findOne({ email: credentials.email });
            if (existingUser) {
              await client.close();
              throw new Error("User already exists");
            }

            // @ts-ignore: No types for bcrypt
            const { hash } = await import('bcrypt');
            const hashedPassword = await hash(credentials.password, 10);
            
            const result = await usersCollection.insertOne({ 
              email: credentials.email, 
              password: hashedPassword, 
              name: credentials.name 
            });

            await client.close();
            return { 
              id: result.insertedId.toString(), 
              email: credentials.email, 
              name: credentials.name 
            };
          } else {
            // Login logic
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

            return { 
              id: user._id.toString(), 
              email: user.email, 
              name: user.name 
            };
          }
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
  },
  debug: process.env.NODE_ENV === 'development',
};
