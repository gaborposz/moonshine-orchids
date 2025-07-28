import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from '../components/Providers';
import Navigation from '../components/Navigation';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

import "../globals.css";

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

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Await the params to get the locale
  const {locale} = await params;
  
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navigation />
            <main>{children}</main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
