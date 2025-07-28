"use client";

import { useEffect, useState } from "react";

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
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to Moonshine Orchids!</h1>
      <p className="text-lg text-center text-gray-600">{backendStatus}</p>
    </div>
  );
}
