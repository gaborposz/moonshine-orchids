"use client";

import { useEffect, useState } from "react";
import UserMenu from "@/app/components/UserMenu";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<string>("Checking backend...");

  useEffect(() => {
    fetch("/api/healthcheck")
      .then(async (res) => {
        const data = await res.json();
        setBackendStatus(data.message);
      })
      .catch(() => {
        setBackendStatus("Backend is offline");
      });
  }, []);


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Moonshine Orchids!</h1>
      <UserMenu />
      <p className="mt-4 text-lg">{backendStatus}</p>
    </main>
  );
}
