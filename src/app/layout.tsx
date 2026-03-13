import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "MoneyLens — Find Your Money Leaks | UAE Credit Card Analyzer",
  description:
    "Upload your UAE credit card statement. See where your money goes in 60 seconds. Get matched to better cards and save thousands in interest. Works with Emirates NBD, ADCB, FAB, HSBC, and more.",
  keywords: [
    "UAE credit card analyzer",
    "credit card statement analyzer",
    "spending breakdown UAE",
    "best credit card UAE",
    "credit card comparison Dubai",
    "Emirates NBD card comparison",
    "save money UAE",
    "credit card rewards UAE",
  ],
  openGraph: {
    title: "MoneyLens — Your Money Has a Leak. Find It in 60 Seconds.",
    description:
      "Upload your UAE bank statement. See exactly where every dirham goes. Get matched to cards that save you more.",
    type: "website",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: "MoneyLens — Find Your Money Leaks",
    description:
      "Upload your UAE credit card statement. See where your money goes. Get matched to better cards.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Umami Analytics — privacy-respecting, no cookies, GDPR-compliant */}
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID || ""}
          strategy="afterInteractive"
        />
        {/* GA4 — backup analytics */}
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-[#0a0a0a] min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
