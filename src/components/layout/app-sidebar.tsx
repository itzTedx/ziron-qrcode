"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { IconPaint } from "@tabler/icons-react";
import { ChevronUp, MoreHorizontal } from "lucide-react";
import { useTheme } from "next-themes";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { Icons } from "../assets/icons";
import { Logo } from "../assets/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const items = [
  {
    title: "Digital Cards",
    url: "/",
    icon: Icons.cards,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { setTheme } = useTheme();
  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 items-center justify-center">
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
              <SidebarMenuButton asChild isActive>
                <Link href={item.url} className="mx-auto p-6">
                  <item.icon className="text-foreground" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction className="right-3">
                    <MoreHorizontal />
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" sideOffset={1}>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Add new</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <span>Company</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Digital Card</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <IconPaint /> Theme
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
