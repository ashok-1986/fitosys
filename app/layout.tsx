import type { Metadata } from "next";
import { Urbanist, Barlow_Condensed } from "next/font/google";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Grain } from "@/components/layout/Grain";
import { headers } from "next/headers";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Fitosys — Business OS for Fitness Coaches",
  description:
    "Automate client onboarding, weekly check-ins, and renewals. Manage 40 clients with the effort of 15.",
  keywords: ["coaching software India", "fitness coach app", "WhatsApp coaching", "Indian coaches", "client management"],
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: "Fitosys — Business OS for Fitness Coaches",
    description: "Automate client onboarding, weekly check-ins, and renewals. Manage 40 clients with the effort of 15.",
    type: "website",
    locale: "en_IN",
    siteName: "Fitosys",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitosys — Business OS for Fitness Coaches",
    description: "Automate client onboarding, weekly check-ins, and renewals. Manage 40 clients with the effort of 15.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Fitosys",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web, Android, iOS",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "description": "Free trial available"
  },
  "description": "Business OS for fitness coaches in India. Automate client onboarding, weekly check-ins, and renewals via WhatsApp.",
  "brand": { "@type": "Brand", "name": "Fitosys" },
  "areaServed": { "@type": "Country", "name": "India" },
  "provider": {
    "@type": "Organization",
    "name": "Alchemetryx",
    "url": "https://fitosys.alchemetryx.com"
  }
};

// Routes where the marketing Nav and Footer should NOT render
const SHELL_ROUTES = [
  "/dashboard",
  "/join",
  "/login",
  "/signup",
  "/forgot-password",
  "/renew",
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  const isShellRoute = SHELL_ROUTES.some(route => pathname.startsWith(route));

  return (
    <html lang="en" className={`${urbanist.variable} ${barlowCondensed.variable}`}>
      <head>
        <link rel="canonical" href="https://fitosys.alchemetryx.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased text-white bg-[#0A0A0A]">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-[#0A0A0A] focus:text-white">
          Skip to main content
        </a>
        <Providers>
          <Grain />
          {!isShellRoute && <Nav />}
          <main id="main-content">
            {children}
          </main>
          {!isShellRoute && <Footer />}
        </Providers>
      </body>
    </html>
  );
}