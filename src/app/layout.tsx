import type { Metadata } from "next";
import { Urbanist, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "Fitosys — Business OS for Fitness Coaches",
  description:
    "Automate client onboarding, weekly check-ins, and renewals. Manage 40 clients with the effort of 15.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500&family=Urbanist:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${urbanist.variable} ${barlowCondensed.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
