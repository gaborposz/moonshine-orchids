"use server"

import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

async function GetServerIP() {
  const os = await import('os');
  const networkInterfaces = os.networkInterfaces();
  let ip = 'unknown';
  for (const iface of Object.values(networkInterfaces)) {
    if (iface) {
      for (const net of iface) {
        if (net.family === 'IPv4' && !net.internal) {
          ip = net.address;
          break;
        }
      }
    }
    if (ip !== 'unknown') break;
  }
  return ip;
}

export async function GET() {
  const mongoDBConnectionString = process.env.MONGO_DB_CONNECTION_STRING;
  if (!mongoDBConnectionString) {
    const errorMsg = 'Backend configuration error';
    console.error(errorMsg);
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }

  let client;

  try {
    client = new MongoClient(mongoDBConnectionString);
    await client.connect();
    await client.db().command({ ping: 1 });

    const ip = await GetServerIP();
    const successMsg = `The backend is up and running on ${ip}`;
    return NextResponse.json({ message: successMsg }, { status: 200 });

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(errorMsg);
    return NextResponse.json({ message: `Failed to connect to DB: ${errorMsg}` }, { status: 500 });

  } finally {
    if (client) {
      await client.close();
    }
  }
}
