import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CollectionProvider } from "@/contexts/CollectionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyPokéCollection",
  description: "Made with love by Steven :)",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // Adding suppressHydrationWarning here to reinforce that the Browser-hydrated HTML only differs due to extensions which is outside of our control. Zero warnings or errors in Incognito mode!
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        {/* Our entire app - including Navbar! my intuition missed this - now wrapped in our CollectionProvider */}
        <CollectionProvider>
          {/* Our interactive not-changing-on-page-change navbar. The only JS that the Browser downloads when serving the page! */}
          <Navbar />

          {/* Our <Outlet /> equivalent! */}
          <main>
            {children}
          </main>
        </CollectionProvider>
      </body>
    </html>
  );
}
