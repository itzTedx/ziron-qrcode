import type { Metadata } from "next";
import { cookies } from "next/headers";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { extractRouterConfig } from "uploadthing/server";

import BreakpointIndicator from "@/components/breakpoint-indicator";
import CompanyFormModal from "@/components/features/modals/company-form-modal";
import ShareModal from "@/components/features/modals/share-modal";
import Header from "@/components/layout/header";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { plusJakarta } from "@/fonts";
import { getCurrentUser } from "@/lib/auth/current-user";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import { getCompanies } from "@/server/actions/get-company";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  const { companies } = await getCompanies();
  const currentUser = await getCurrentUser({
    redirectIfNotFound: true,
    withFullUser: true,
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", plusJakarta.className)}>
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div vaul-drawer-wrapper="" className="w-full flex-1 bg-background">
              <SidebarProvider defaultOpen={defaultOpen}>
                <NextSSRPlugin
                  routerConfig={extractRouterConfig(ourFileRouter)}
                />

                <AppSidebar
                  collapsible="icon"
                  variant="inset"
                  data={companies}
                  user={currentUser}
                />
                <SidebarInset>
                  <Header />
                  <ShareModal />
                  <ScrollArea className="-mt-20">{children}</ScrollArea>
                  <CompanyFormModal />
                  <BreakpointIndicator />
                </SidebarInset>
              </SidebarProvider>
            </div>
            <Toaster richColors />
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
