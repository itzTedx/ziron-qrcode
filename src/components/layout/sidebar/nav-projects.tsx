"use client";

import Image from "next/image";
import Link from "next/link";

import { IconDots } from "@tabler/icons-react";
import { Trash2 } from "lucide-react";

import { Icons } from "@/components/assets/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { CompanyType } from "@/server/schema";

interface Props {
  data?: CompanyType[];
}

export function NavProjects({ data }: Props) {
  const { isMobile } = useSidebar();

  if (data)
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Companies</SidebarGroupLabel>
        <SidebarMenu>
          {data.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild tooltip={item.name}>
                <Link href="/">
                  {item.logo && (
                    <div className="relative size-4 shrink-0">
                      <Image
                        src={item.logo}
                        fill
                        alt={item.name}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <IconDots />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <Icons.cards className="size-4 text-muted-foreground" />
                    <span className="pl-1 text-sm">Create card</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="size-4 text-muted-foreground" />
                    <span className="pl-1 text-sm">Delete Company</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
}
