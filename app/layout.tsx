import type { Metadata } from "next";
import { Urbanist, Barlow_Condensed, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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

// JSON-LD Structured Data for SoftwareApplication (TR-35)
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
  "brand": {
    "@type": "Brand",
    "name": "Fitosys"
  },
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "provider": {
    "@type": "Organization",
    "name": "Alchemetryx",
    "url": "https://fitosys.alchemetryx.com"
  }
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
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Urbanist:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href="https://fitosys.alchemetryx.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${urbanist.variable} ${barlowCondensed.variable} ${playfairDisplay.variable} font-sans antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground">
          Skip to main content
        </a>
        <Providers>
          <main id="main-content">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
