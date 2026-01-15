import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],       // required
  weight: ["400", "500", "700"], // choose font weights
  variable: "--font-poppins" // optional: CSS variable name
});

export const metadata: Metadata = {
  title: "SPK Up to date",
  description: "Update SPK Bengkel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <body
        className={`${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
