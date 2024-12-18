import type { Metadata } from "next";
import { cookies } from "next/headers";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import BreakpointIndicator from "@/components/breakpoint-indicator";
import CompanyFormModal from "@/components/features/modals/company-form-modal";
import ShareModal from "@/components/features/modals/share-modal";
import { AppSidebar } from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { plusJakarta } from "@/fonts";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
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
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("flex w-full antialiased", plusJakarta.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={defaultOpen}>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />

            <AppSidebar collapsible="icon" />
            <div className="flex-1">
              <Header />
              <ShareModal />
              {children}
              <CompanyFormModal />
              <BreakpointIndicator />
              <Toaster richColors closeButton />
            </div>
          </SidebarProvider>{" "}
        </ThemeProvider>
      </body>
    </html>
  );
}
