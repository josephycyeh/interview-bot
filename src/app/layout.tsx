import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
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
  title: "InterviewBot - AI-Powered Coding Practice",
  description: "Practice coding interviews with an AI-powered platform that provides real-time feedback and guidance.",
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
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e1e1e',
              color: '#ededed',
              border: '1px solid #2d2d2d',
              fontSize: '14px',
              padding: '12px 16px',
              maxWidth: '400px',
              fontFamily: 'var(--font-geist-sans)',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
