import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcrypt";
import { MongoClient, Collection, ObjectId } from "mongodb";

interface UserDocument {
  email: string;
  password: string;
  name?: string;
  _id?: ObjectId;
}

interface Credentials {
  email: string;
  password: string;
  name?: string;
  action: 'login' | 'register';
}
import { DB_NAME, USERS_COLLECTION } from "../db/constants";

const uri = process.env.MONGO_DB_CONNECTION_STRING as string;

async function registerUser(credentials: Credentials, usersCollection: Collection<UserDocument>) {
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
    name: credentials.name,
    image: null // required by NextAuth User type
  };
}

async function loginUser(credentials: Credentials, usersCollection: Collection<UserDocument>) {
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
    name: user.name,
    image: null // required by NextAuth User type
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
        name: { label: "Name", type: "text", optional: true },
        action: { label: "Action", type: "text", value: "login" } // Default to 'login'
      },
      async authorize(credentials): Promise<{ id: string; email: string; name?: string; image: string | null; } | null> {
        if (!credentials) {
          throw new Error("No credentials provided");
        }
        
        if (!credentials.email || !credentials.password) {
          console.log('Missing fields:', {
            hasEmail: !!credentials.email,
            hasPassword: !!credentials.password,
          });
          throw new Error("Missing required credentials");
        }

        // For regular login attempts (when no action is specified), assume login
        const validatedCredentials: Credentials = {
          email: credentials.email,
          password: credentials.password,
          name: credentials.name,
          action: (credentials.action || 'login') as 'login' | 'register'
        };

        if (validatedCredentials.action !== 'login' && validatedCredentials.action !== 'register') {
          throw new Error("Invalid action specified");
        }

        const client = new MongoClient(uri);
        try {
          await client.connect();
          const usersCollection = client.db(DB_NAME).collection<UserDocument>(USERS_COLLECTION);

          if (validatedCredentials.action === 'register') {
            return await registerUser(validatedCredentials, usersCollection);
          } else {
            return await loginUser(validatedCredentials, usersCollection);
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
