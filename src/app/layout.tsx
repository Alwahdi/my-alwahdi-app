// src/app/layout.tsx

import type { Metadata } from "next";
import { Noto_Sans, Public_Sans } from "next/font/google"; // Import the fonts
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

// Configure your fonts with desired weights and subsets
const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-public-sans", // Define a CSS variable for Public Sans
  display: "swap", // Ensures text remains visible during webfont load
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans", // Define a CSS variable for Noto Sans
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alwahdi - AI-Powered Groundwater Analysis",
  description:
    "AI-Powered Groundwater Analysis and Prediction, empowering sustainable water management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        {/* Apply font CSS variables to the body. publicSans.variable applies --font-public-sans, etc. */}
        <body className={`${publicSans.variable} ${notoSans.variable}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
