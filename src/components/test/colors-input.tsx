"use client";

import { memo, useCallback, useMemo, useState } from "react";

import { HexColorPicker } from "react-colorful";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useMediaQuery } from "@/hooks/use-media-query";

import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";

const HEX_VALUES = [
  {
    color: "Blue",
    value: "#3b82f6",
  },
  {
    color: "Indigo",
    value: "#6366f1",
  },
  {
    color: "Pink",
    value: "#ec4899",
  },
  {
    color: "Red",
    value: "#ef4444",
  },
  {
    color: "orange",
    value: "#f97316",
  },
  {
    color: "yellow",
    value: "#eab308",
  },
  {
    color: "Green",
    value: "#22c55e",
  },
] as const;

// Validation helper
const isValidHexColor = (color: string) =>
  /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);

const ColorRadioItem = memo(
  ({ value, color }: { value: string; color: string }) => (
    <RadioGroupItem
      key={color}
      value={value}
      id={color}
      aria-label={color}
      style={{
        borderColor: value,
        backgroundColor: value,
      }}
    />
  )
);
ColorRadioItem.displayName = "ColorRadioItem";

interface Props {
  value: string;
  onChange: (newValue: string) => void;
}

export default function ColorsInput({ value = "#4938ff", onChange }: Props) {
  const [color, setColor] = useState(value);

  const onColorChange = useDebouncedCallback((newColor: string) => {
    if (isValidHexColor(newColor)) {
      onChange(newColor);
      setColor(newColor);
    }
  }, 500);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      if (!newValue.startsWith("#")) {
        newValue = `#${newValue.replace("#", "")}`;
      }
      setColor(newValue);
      if (isValidHexColor(newValue)) {
        onColorChange(newValue);
      }
    },
    [onColorChange]
  );

  const colorItems = useMemo(
    () =>
      HEX_VALUES.map((item) => (
        <ColorRadioItem
          key={item.color}
          value={item.value}
          color={item.color}
        />
      )),
    []
  );

  return (
    <fieldset className="flex gap-5 max-sm:flex-col sm:items-center">
      <RadioGroup
        className="flex gap-3"
        value={color}
        onValueChange={onColorChange}
      >
        {colorItems}
      </RadioGroup>
      <div
        className="flex overflow-hidden rounded-md border-2 md:items-center"
        style={{
          borderColor: color,
        }}
      >
        <MemoizedResponsiveInput value={color}>
          <HexColorPicker
            color={color}
            onChange={onColorChange}
            className="!size-64"
          />
        </MemoizedResponsiveInput>

        <Input
          className="h-9 w-24 rounded-none border-0 focus-visible:ring-0"
          value={color}
          onChange={handleInputChange}
        />
      </div>
    </fieldset>
  );
}

const ResponsiveInput = memo(
  ({ value, children }: { value: string; children: React.ReactNode }) => {
    const { isMobile } = useMediaQuery();

    if (isMobile) {
      return (
        <Drawer>
          <DrawerTrigger
            type="button"
            className="size-9 shrink-0"
            style={{
              backgroundColor: value,
            }}
          />
          <DrawerContent className="items-center gap-4">
            <DrawerHeader>
              <DrawerTitle>Customize Color</DrawerTitle>
            </DrawerHeader>
            {children}
            <DrawerFooter className="w-full">
              <Button>Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );
    }
    return (
      <Tooltip>
        <TooltipProvider delayDuration={0}>
          <TooltipTrigger
            type="button"
            className="size-9 shrink-0"
            style={{
              backgroundColor: value,
            }}
          />
          <TooltipContent className="p-4">{children}</TooltipContent>
        </TooltipProvider>
      </Tooltip>
    );
  }
);
ResponsiveInput.displayName = "ResponsiveInput";

const MemoizedResponsiveInput = memo(ResponsiveInput);
