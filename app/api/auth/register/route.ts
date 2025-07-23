"use server"

import { NextResponse } from 'next/server';
// @ts-ignore: No types for bcrypt
import { hash } from 'bcrypt';
import { MongoClient } from 'mongodb';
import { DB_NAME, USERS_COLLECTION } from '@/lib/configs/db/constants';

const uri = process.env.MONGO_DB_CONNECTION_STRING as string;

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }
    const client = new MongoClient(uri);
    await client.connect();
    const usersCollection = client.db(DB_NAME).collection(USERS_COLLECTION);
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      await client.close();
      return NextResponse.json({ message: 'User already exists.' }, { status: 409 });
    }
    const hashedPassword = await hash(password, 10);
    const result = await usersCollection.insertOne({ email, password: hashedPassword, name });
    await client.close();
    return NextResponse.json({ message: 'User registered successfully.' }, { status: 201 });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
}
