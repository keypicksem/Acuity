import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/providers";
import { NavBar } from "@/components/nav-bar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Acuity — The daily debrief that turns chaos into clarity",
  description:
    "Speak for 60 seconds. AI extracts your tasks, tracks your goals, decodes your mental patterns, and writes your weekly report — automatically.",
  metadataBase: new URL("https://getacuity.io"),
  alternates: {
    canonical: "https://getacuity.io",
  },
  openGraph: {
    url: "https://getacuity.io",
    siteName: "Acuity",
    images: [{ url: "/web-app-manifest-512x512.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','5752790988087389');fbq('track','PageView');`,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=5752790988087389&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="bg-[#FAFAF7] text-zinc-900 antialiased">
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
