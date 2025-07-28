import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from './components/Providers';
import Navigation from './components/Navigation';

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moonshine Orchids" + (process.env.NEXT_PUBLIC_ENVIRONMENT_NAME ? ` (${process.env.NEXT_PUBLIC_ENVIRONMENT_NAME})` : ""),  
  description: "Orchid webshop prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navigation />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}