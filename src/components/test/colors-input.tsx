"use client";

import { HexColorPicker } from "react-colorful";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
];

export default function ColorsInput({
  value = "#4938ff",
  onChange,
}: {
  value: string;
  onChange: (newValue: string) => void;
}) {
  return (
    <fieldset className="flex items-center gap-5">
      <RadioGroup className="flex gap-2" value={value} onValueChange={onChange}>
        {HEX_VALUES.map((value) => (
          <RadioGroupItem
            key={value.color}
            value={value.value}
            id={value.color}
            aria-label={value.color}
            style={{
              borderColor: value.value,
              backgroundColor: value.value,
            }}
          />
        ))}
      </RadioGroup>
      <div
        className="flex items-center overflow-hidden rounded-md border-2"
        style={{
          borderColor: value,
        }}
      >
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger
              type="button"
              className="size-9 shrink-0"
              style={{
                backgroundColor: value,
              }}
            />
            <TooltipContent className="p-4">
              <HexColorPicker color={value} onChange={onChange} />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Input
          className="h-9 w-24 rounded-none border-0 focus-visible:ring-0"
          value={value}
          onChange={(e) => {
            let newValue = e.target.value;
            if (!newValue.startsWith("#")) {
              newValue = `#${newValue.replace("#", "")}`;
            }
            onChange(newValue);
          }}
        />
      </div>
    </fieldset>
  );
}
