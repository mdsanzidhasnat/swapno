import type { Metadata } from "next";
import "./globals.css";
import "../components/sites/shwapno/shwapno-home.css";

export const metadata: Metadata = {
  title: "Shwapno Online Grocery Shopping",
  description: "Shop fresh groceries, daily essentials and more at Shwapno.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
