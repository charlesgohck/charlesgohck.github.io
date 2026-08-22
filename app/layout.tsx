import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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

const siteUrl = process.env.PUBLIC_SITE_URL || "https://charlesgohck.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Charles Goh C.K | Software Engineer",
    template: "%s | Charles Goh C.K",
  },
  description:
    "Software engineer specializing in full-stack development. Explore my portfolio, experience, publications, and blog on technology and software engineering.",
  keywords: [
    "Charles Goh",
    "Software Engineer",
    "Full Stack Developer",
    "Web Development",
    "Technology Blog",
    "Software Development",
  ],
  authors: [{ name: "Charles Goh C.K" }],
  creator: "Charles Goh C.K",
  publisher: "Charles Goh C.K",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Charles Goh C.K",
    title: "Charles Goh C.K | Software Engineer",
    description:
      "Software engineer specializing in full-stack development. Explore my portfolio, experience, publications, and blog.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Charles Goh C.K | Software Engineer",
    description:
      "Software engineer specializing in full-stack development. Explore my portfolio, experience, publications, and blog.",
    creator: "@charlesgohck",
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: siteUrl,
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
