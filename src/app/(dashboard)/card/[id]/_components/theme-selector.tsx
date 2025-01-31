"use client";

import Image from "next/image";
import { useId, useMemo } from "react";

import { IconCheck } from "@tabler/icons-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

// Move items outside component to prevent recreation
const THEME_ITEMS = [
  { value: "default", label: "Default", image: "/images/default-template.png" },
  { value: "modern", label: "Modern", image: "/images/modern-template.png" },
  { value: "card", label: "Card", image: "/images/card-template.png" },
] as const;

// Extract static styles
const imageContainerStyles = "relative aspect-[7/15] h-60 md:h-96 lg:h-[30rem]";
const radioItemStyles = "peer sr-only after:absolute after:inset-0";
const radioWrapperStyles =
  "relative shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-input p-1 shadow-sm shadow-black/5 outline-offset-2 transition-colors peer-[:focus-visible]:outline peer-[:focus-visible]:outline-2 peer-[:focus-visible]:outline-ring/70 peer-data-[disabled]:cursor-not-allowed peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent peer-data-[disabled]:opacity-50 md:p-2";

export const ThemeSelector = ({ onChange, value }: Props) => {
  const id = useId();

  // Memoize the radio items
  const radioItems = useMemo(
    () =>
      THEME_ITEMS.map((item) => (
        <label
          key={`${id}-${item.value}`}
          className="grid shrink-0 flex-col items-center justify-center"
        >
          <RadioGroupItem
            id={`${id}-${item.value}`}
            value={item.value}
            className={radioItemStyles}
          />
          <div className={radioWrapperStyles}>
            <div className={imageContainerStyles}>
              <Image
                src={item.image}
                alt={item.label}
                fill
                priority
                sizes="(max-width: 768px) 60vh, (max-width: 1024px) 96vh, 30rem"
                className="rounded-xl object-cover"
              />
            </div>
          </div>

          <span className="group mt-2 flex items-center justify-center gap-2">
            <div className="flex aspect-square size-5 items-center justify-center rounded-full border border-primary text-background shadow-none ring-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 disabled:cursor-not-allowed disabled:opacity-50 peer-data-[state=checked]:group-[]:border-primary peer-data-[state=checked]:group-[]:bg-primary peer-data-[state=checked]:group-[]:ring-1 peer-data-[state=checked]:group-[]:ring-foreground">
              <IconCheck
                size={16}
                strokeWidth={2}
                className="peer-data-[state=unchecked]:group-[]:hidden"
                aria-hidden="true"
              />
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </span>
        </label>
      )),
    [id]
  );

  return (
    <fieldset className="space-y-4">
      <RadioGroup
        className="flex gap-3"
        onValueChange={onChange}
        defaultValue={value}
      >
        {radioItems}
      </RadioGroup>
    </fieldset>
  );
};
