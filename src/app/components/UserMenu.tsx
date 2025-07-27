"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (session?.user) {
    return (
      <div data-testid="user-menu" className="flex items-center gap-4 mt-4">
        <span className="font-semibold">Hello, {session.user.name || session.user.email}!</span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 mt-4">
      <Link href="/login" className="text-blue-600 underline">Login</Link>
      <Link href="/register" className="text-blue-600 underline">Register</Link>
    </div>
  );
}
