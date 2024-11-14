import { Metadata } from "next";

import { ScrollArea } from "@/components/ui/scroll-area";
import "@/styles/globals.css";

import Footer from "../_components/footer";

export const metadata: Metadata = {
  title: "Preview",
  description: "Generated by create next app",
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
    <>
      <ScrollArea className="h-[700px] max-w-md md:overflow-hidden md:rounded-xl md:shadow-xl">
        <main className="relative">{children}</main>
      </ScrollArea>
      <Footer />
    </>
  );
}
