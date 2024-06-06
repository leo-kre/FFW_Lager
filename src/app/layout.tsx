import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const favicon = "../../public/favicon.ico";

export const metadata: Metadata = {
      title: "FFW-KLU Lager",
      description: "Lager System der FFW KLU",
};

export default function RootLayout({
      children,
}: Readonly<{
      children: React.ReactNode;
}>) {
      return (
            <html lang="en">
                  <body className={inter.className + " bg-slate-50 text-black dark:text-white overflow-hidden"}>{children}</body>
            </html>
      );
}
