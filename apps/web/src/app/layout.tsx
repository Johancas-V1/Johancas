import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JCM - Johan Castellanos Memos",
  description:
    "A Message To The Last Generation - Bible Prophecy, Politics, and The Kingdom of God",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
