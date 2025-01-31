"use client";

import React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

interface Props {
  children: React.ReactNode;
  isOpen?: boolean;
  asChild?: boolean;
  trigger?: React.ReactNode;
  closeModal?: (value: boolean) => void;
  title: string;
  description?: string;
  className?: string;
}

export const ResponsiveModal = ({
  children,
  className,
  isOpen,
  closeModal,
  trigger,
  asChild,
  title,
  description,
}: Props) => {
  const { isMobile } = useMediaQuery();

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={closeModal}>
        {trigger && <DrawerTrigger asChild={asChild}>{trigger}</DrawerTrigger>}
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription className="sr-only">{title}</DrawerDescription>
            )}
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      {trigger && <DialogTrigger asChild={asChild}>{trigger}</DialogTrigger>}
      <DialogContent className={cn("p-0", "max-w-xl", className)}>
        <DialogHeader className="border-b p-6">
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription className="sr-only">{title}</DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
