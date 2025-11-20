import "../style/globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./componets/organisms/Header";
import SkipLink from "./components/accessibility/SkipLink";
import Navigation from "./components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Accessible Landmark Platform",
  description: "An accessible platform for exploring landmarks and connecting with medical professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-main-gray w-full`}
      >
        <SkipLink />
        {/* <Header /> */}
        <Navigation />
        <main id="main-content" role="main" className="max-w-screen-2xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
