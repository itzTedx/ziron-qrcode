import type { Metadata } from "next";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import ShareModal from "@/components/modals/share-modal";
import { Toaster } from "@/components/ui/sonner";
import { plusJakarta } from "@/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";

import { ourFileRouter } from "../api/uploadthing/core";

export const metadata: Metadata = {
  title: "QR Code Generator",
  description: "Generated by create next app",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("flex w-full antialiased", plusJakarta.className)}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Sidebar />
        <div className="relative flex-1">
          <Header />
          <ShareModal />
          {children}
          <Toaster richColors />
        </div>
      </body>
    </html>
  );
}
