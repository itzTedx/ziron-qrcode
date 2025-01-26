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
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
