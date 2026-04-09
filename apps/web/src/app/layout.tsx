import type { Metadata } from "next";
import "./globals.css";

import { Providers } from "@/components/providers";
import { NavBar } from "@/components/nav-bar";

export const metadata: Metadata = {
  title: "Acuity",
  description: "Brain dump daily. Get your life back.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
