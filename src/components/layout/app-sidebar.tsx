"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { Icons } from "../assets/icons";
import { Logo } from "../assets/logo";

const items = [
  {
    title: "Digital Cards",
    url: "/",
    icon: Icons.cards,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="bp data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          onClick={() => router.push("/")}
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
            <Icons.zironLogo className="size-6" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <Logo className="h-6" />
          </div>
        </SidebarMenuButton>
        {/* <Logo /> */}
      </SidebarHeader>
      <SidebarContent className="border-t">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url} className="mx-auto p-6">
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
