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
  onChange: () => void;
}) {
  return (
    <fieldset className="flex items-center gap-5">
      <RadioGroup
        className="flex gap-2"
        defaultValue="#3b82f6"
        value={value}
        onValueChange={onChange}
      >
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
            // className="data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
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
            onChange();
          }}
        />
      </div>
    </fieldset>
  );
}

{
  /* <RadioGroupItem
          value="blue"
          id="radio-07-blue"
          aria-label="Blue"
          className="border-blue-500 bg-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
        />
        <RadioGroupItem
          value="indigo"
          id="radio-07-indigo"
          aria-label="Indigo"
          className="border-indigo-500 bg-indigo-500 data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-500"
        />
        <RadioGroupItem
          value="pink"
          id="radio-07-pink"
          aria-label="Pink"
          className="border-pink-500 bg-pink-500 data-[state=checked]:border-pink-500 data-[state=checked]:bg-pink-500"
        />
        <RadioGroupItem
          value="red"
          id="radio-07-red"
          aria-label="Red"
          className="border-red-500 bg-red-500 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500"
        />
        <RadioGroupItem
          value="orange"
          id="radio-07-orange"
          aria-label="orange"
          className="border-orange-500 bg-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
        />
        <RadioGroupItem
          value="yellow"
          id="radio-07-yellow"
          aria-label="yellow"
          className="border-yellow-500 bg-yellow-500 data-[state=checked]:border-yellow-500 data-[state=checked]:bg-yellow-500"
        />
        <RadioGroupItem
          value="green"
          id="radio-07-green"
          aria-label="green"
          className="border-green-500 bg-green-500 data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500"
        /> */
}
