import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],       // required
  weight: ["400", "500", "700"], // choose font weights
  variable: "--font-poppins" // optional: CSS variable name
});

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.'
}

export default function GlobalNotFound() {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <section className="bg-white dark:bg-gray-900 ">
          <div className="container min-h-screen px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12">
            <div className="wf-ull lg:w-1/2">
              <p className="text-lg font-bold text-blue-500 dark:text-blue-400">Waduhh....</p>
              <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">Mainnya Kejauhan Bre...</h1>
              <p className="mt-4 text-gray-500 dark:text-gray-400">Ngga ada apa-apa disini, Kuy lah balik lagi</p>
            </div>

            <div className="relative w-full mt-12 lg:w-1/2 lg:mt-0">
              <Image
                src="/images/illustration.svg"
                alt="404 Illustration"
                width={600}
                height={370}
                priority
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          </div>
        </section>
      </body>
    </html>
  )
}