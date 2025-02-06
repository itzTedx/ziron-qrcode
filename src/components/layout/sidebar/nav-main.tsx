"use client";

import Link from "next/link";

import { IconBuildingCog, IconPlus } from "@tabler/icons-react";

import { Icons } from "@/components/assets/icons";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useCompanyFormModal } from "@/store/use-company-form-modal";

export function NavMain() {
  const openModal = useCompanyFormModal((state) => state.openModal);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Digital Card</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={"Digital Card"}
            onClick={() => {
              openModal();
            }}
          >
            <IconBuildingCog />
            <span className="text-sm font-medium">Add Company</span>
          </SidebarMenuButton>

          <SidebarMenuAction>
            <IconPlus className="size-3 text-gray-300" />
          </SidebarMenuAction>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/card/new">
            <SidebarMenuButton tooltip={"Digital Card"}>
              <Icons.cards />
              <span className="text-sm font-medium">Create Card</span>
            </SidebarMenuButton>

            <SidebarMenuAction>
              <IconPlus className="size-3 text-gray-300" />
            </SidebarMenuAction>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
