"use client";

import Link from "next/link";

import { IconPlus } from "@tabler/icons-react";
import { ChevronRight } from "lucide-react";

import { Icons } from "@/components/assets/icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { CompanyType } from "@/server/schema";
import { useCompanyFormModal } from "@/store/use-company-form-modal";

interface Props {
  items?: CompanyType[];
}

export function NavMain({ items }: Props) {
  const openModal = useCompanyFormModal((state) => state.openModal);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Digital Card</SidebarGroupLabel>
      <SidebarMenu>
        {items && (
          <Collapsible asChild>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={"Digital Card"}>
                <Link href="/">
                  <Icons.cards />
                  <span>Companies</span>
                </Link>
              </SidebarMenuButton>

              <SidebarMenuAction
                className="right-7"
                onClick={() => {
                  openModal();
                }}
              >
                <IconPlus />
              </SidebarMenuAction>
              <CollapsibleTrigger asChild>
                <SidebarMenuAction className="data-[state=open]:rotate-90">
                  <ChevronRight />
                  <span className="sr-only">Toggle</span>
                </SidebarMenuAction>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.name}>
                      <SidebarMenuSubButton asChild>
                        <Link href={`/card/new?company=${subItem.id}`}>
                          <span>{subItem.name}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
