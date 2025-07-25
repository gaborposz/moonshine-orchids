import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcrypt";
import { MongoClient } from "mongodb";
import { DB_NAME, USERS_COLLECTION } from "../db/constants";

const uri = process.env.MONGO_DB_CONNECTION_STRING as string;

async function registerUser(credentials: any, usersCollection: any) {
  const existingUser = await usersCollection.findOne({ email: credentials.email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const { hash } = await import('bcrypt');
  const hashedPassword = await hash(credentials.password, 10);
  
  const result = await usersCollection.insertOne({ 
    email: credentials.email, 
    password: hashedPassword, 
    name: credentials.name 
  });

  return { 
    id: result.insertedId.toString(), 
    email: credentials.email, 
    name: credentials.name 
  };
}

async function loginUser(credentials: any, usersCollection: any) {
  const user = await usersCollection.findOne({ email: credentials.email });
  if (!user) {
    throw new Error("No user found with this email");
  }

  const isValid = await compare(credentials.password, user.password);
  if (!isValid) {
    throw new Error("Invalid password");
  }

  return { 
    id: user._id.toString(), 
    email: user.email, 
    name: user.name 
  };
}

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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const client = new MongoClient(uri);
        try {
          await client.connect();
          const usersCollection = client.db(DB_NAME).collection(USERS_COLLECTION);

          if (credentials.action === 'register') {
            return await registerUser(credentials, usersCollection);
          } else {
            return await loginUser(credentials, usersCollection);
          }
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        } finally {
          await client.close();
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
