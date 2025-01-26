"use client";

import { PropsWithChildren, ReactNode, WheelEventHandler } from "react";

import * as PopoverPrimitive from "@radix-ui/react-popover";

// import { Drawer } from "vaul";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export type PopoverProps = PropsWithChildren<{
  content: ReactNode | string;
  align?: "center" | "start" | "end";
  side?: "bottom" | "top" | "left" | "right";
  openPopover: boolean;
  setOpenPopover: (open: boolean) => void;
  mobileOnly?: boolean;
  popoverContentClassName?: string;
  collisionBoundary?: Element | Element[];
  sticky?: "partial" | "always";
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onWheel?: WheelEventHandler;
}>;

export function Popover({
  children,
  content,
  align = "center",
  side = "bottom",
  openPopover,
  setOpenPopover,
  mobileOnly,
  popoverContentClassName,
  collisionBoundary,
  sticky,
  onEscapeKeyDown,
  onWheel,
}: PopoverProps) {
  const { isMobile } = useMediaQuery();

  if (mobileOnly || isMobile) {
    return (
      <Drawer open={openPopover} onOpenChange={setOpenPopover}>
        <DrawerTrigger className="sm:hidden" asChild>
          {children}
        </DrawerTrigger>

        <DrawerContent>{content}</DrawerContent>
      </Drawer>
    );
  }

  return (
    <PopoverPrimitive.Root open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverPrimitive.Trigger className="sm:inline-flex" asChild>
        {children}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={8}
          align={align}
          side={side}
          className={cn(
            "animate-slide-up-fade z-50 items-center rounded-lg border border-gray-200 bg-white drop-shadow-lg sm:block",
            popoverContentClassName
          )}
          sticky={sticky}
          collisionBoundary={collisionBoundary}
          onEscapeKeyDown={onEscapeKeyDown}
          onWheel={onWheel}
        >
          {content}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
