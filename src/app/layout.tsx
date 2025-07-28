import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moonshine Orchids" + (process.env.NEXT_PUBLIC_ENVIRONMENT_NAME ? ` (${process.env.NEXT_PUBLIC_ENVIRONMENT_NAME})` : ""),  
  description: "Orchid webshop prototype",
};

// Since we have a `[locale]` directory, this layout will be used
// for the root level where we redirect to the default locale
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}