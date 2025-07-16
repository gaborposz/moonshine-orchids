"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<string>("Checking backend...");

  useEffect(() => {
    fetch("/api/healthcheck")
      .then((res) => res.json())
      .then((data) => {
        if (data === true) {
          setBackendStatus("Backend is online");
        } else {
          setBackendStatus("Backend error");
        }
      })
      .catch(() => {
        setBackendStatus("Backend is offline");
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Moonshine Orchids!</h1>
      <p className="mt-4 text-lg">{backendStatus}</p>
    </main>
  );
}
