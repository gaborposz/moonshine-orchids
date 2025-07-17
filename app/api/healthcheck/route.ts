"use server"

import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  console.log('HealthCheck API was called');
  const dbPassword = process.env.MONGO_DB_PASSWORD;
  const uri = `mongodb+srv://WebPageUser:${dbPassword}@moonshinecluster-prod.bsp5mgb.mongodb.net/?retryWrites=true&w=majority&appName=MoonshineCluster-Prod`;
  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();
    await client.db().command({ ping: 1 });
    return NextResponse.json(true);
  } catch (error) {
    console.error('HealthCheck API error: ', error);
    return NextResponse.json(false);
  } finally {
    if (client) {
      await client.close();
    }
  }
}
