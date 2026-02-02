import type { Metadata } from "next";
import { Bricolage_Grotesque, Fraunces } from "next/font/google";
import "./globals.css";

const uiFont = Bricolage_Grotesque({
  variable: "--font-ui",
  subsets: ["latin"],
});

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "littlestoic",
  description: "Interaktiv sagapp för barn 6–10 år.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={`${uiFont.variable} ${displayFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
