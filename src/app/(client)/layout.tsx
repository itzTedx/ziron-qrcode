import { Metadata } from "next";

import { ScrollArea } from "@/components/ui/scroll-area";
import { plusJakarta } from "@/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";

import Footer from "./_components/footer";

export const metadata: Metadata = {
  title: "Ziron Media - Digital Card",
  description: "Digital Card",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.png",
  },
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  referrer: "no-referrer",
  generator: "Next.js",
  robots: {
    index: false,
    follow: false,
    nocache: false,
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={cn(
          "flex min-h-dvh @container sm:items-center sm:justify-center",
          plusJakarta.className
        )}
      >
        <ScrollArea className="h-svh sm:h-[700px] sm:overflow-hidden sm:rounded-xl sm:shadow-xl md:max-w-md">
          <main className="relative">{children}</main>
        </ScrollArea>
        <Footer />
      </body>
    </html>
  );
}
