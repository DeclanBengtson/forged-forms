import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "FormFlow - Handle Form Submissions Without Backend Code",
  description: "A lightweight, developer-friendly service that handles form submissions from any static or client-rendered website. No server setup required.",
  keywords: ["forms", "form handling", "no backend", "static sites", "form submissions", "developer tools"],
  authors: [{ name: "FormFlow Team" }],
  openGraph: {
    title: "FormFlow - Handle Form Submissions Without Backend Code",
    description: "A lightweight, developer-friendly service that handles form submissions from any static or client-rendered website. No server setup required.",
    type: "website",
  },
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
        {children}
      </body>
    </html>
  );
}
