import type { Metadata } from "next";
import "./globals.css";
import { Roboto, Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@next/third-parties/google'
import { SessionProvider } from "next-auth/react";


const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <main >{children}</main>
        <footer></footer>
        <Analytics />
        <SpeedInsights />

      </body>
    </html>
  );
}
