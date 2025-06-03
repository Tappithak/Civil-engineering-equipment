import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Equipment Management System",
  description: "ระบบจัดการเครื่องจักรทุ่นแรง",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        {/* Meta Tags - ย้ายไปใน head และลบที่ซ้ำ */}
        <meta charSet="UTF-8" />
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" 
        />
        <meta name="theme-color" content="#a20c0c96" />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Highcharts Scripts - ลำดับสำคัญ! */}
        <Script
          src="https://code.highcharts.com/highcharts.js"
          strategy="beforeInteractive"
          id="highcharts-core"
        />
        <Script
          src="https://code.highcharts.com/modules/map.js"
          strategy="beforeInteractive"
          id="highcharts-map"
        />
        {/* ไม่ต้อง preload topology data เพราะจะโหลดในตอน runtime */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
