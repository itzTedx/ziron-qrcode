import type { Metadata } from "next";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import BreakpointIndicator from "@/components/breakpoint-indicator";
import CompanyFormModal from "@/components/features/modals/company-form-modal";
import ShareModal from "@/components/features/modals/share-modal";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
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
          <CompanyFormModal />
          <BreakpointIndicator />
          <Toaster richColors />
        </div>
      </body>
    </html>
  );
}
