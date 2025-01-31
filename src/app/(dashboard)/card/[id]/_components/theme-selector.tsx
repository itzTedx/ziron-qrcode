import Image from "next/image";
import { useId } from "react";

import { IconCheck } from "@tabler/icons-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const items = [
  { value: "default", label: "Default", image: "/images/default-template.png" },
  { value: "modern", label: "Modern", image: "/images/modern-template.png" },
  { value: "card", label: "Card", image: "/images/card-template.png" },
];

export const ThemeSelector = ({ onChange, value }: Props) => {
  const id = useId();
  return (
    <>
      <fieldset className="space-y-4">
        <legend className="text-sm font-medium leading-none text-foreground">
          Choose a theme
        </legend>
        <RadioGroup
          className="flex gap-3"
          onValueChange={onChange}
          defaultValue={value}
        >
          {items.map((item) => (
            <label
              key={`${id}-${item.value}`}
              className="grid shrink-0 flex-col items-center justify-center"
            >
              <RadioGroupItem
                id={`${id}-${item.value}`}
                value={item.value}
                className="peer sr-only after:absolute after:inset-0"
              />
              <div className="relative aspect-[7/15] h-60 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-input p-1 shadow-sm shadow-black/5 outline-offset-2 transition-colors peer-[:focus-visible]:outline peer-[:focus-visible]:outline-2 peer-[:focus-visible]:outline-ring/70 peer-data-[disabled]:cursor-not-allowed peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent peer-data-[disabled]:opacity-50 md:h-96 md:p-2 lg:h-[30rem]">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  className="rounded-xl object-cover"
                />
              </div>

              <span className="group mt-2 flex items-center justify-center gap-2 peer-data-[state=unchecked]:text-muted-foreground/70">
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
          ))}
        </RadioGroup>
      </fieldset>
      {/* <RadioGroup
        onValueChange={onChange}
        defaultValue={value}
        className="flex gap-9"
      >
        <FormItem className="flex flex-col items-center space-y-3">
          <Image
            src="/images/default-template.png"
            height={552}
            width={256}
            alt=""
            className="rounded-xl"
          />

          <div className="flex items-center space-x-3 space-y-0">
            <FormControl>
              <RadioGroupItem
                value="default"
                id="default"
                aria-label="Default Template"
                className="size-5 border-primary shadow-none data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              />
            </FormControl>
            <FormLabel className="font-normal" htmlFor="default">
              Default
            </FormLabel>
          </div>
        </FormItem>
        <FormItem className="flex flex-col items-center space-y-3">
          <Image
            src="/images/modern-template.png"
            height={552}
            width={256}
            alt=""
            className="rounded-xl"
          />
          <div className="flex items-center space-x-3 space-y-0">
            <FormControl>
              <RadioGroupItem
                value="modern"
                id="modern"
                aria-label="Modern template"
                className="size-5 border-primary shadow-none data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              />
            </FormControl>
            <FormLabel className="font-normal" htmlFor="modern">
              Modern
            </FormLabel>
          </div>
        </FormItem>
        <FormItem className="flex flex-col items-center space-y-3">
          <Image
            src="/images/card-template.png"
            height={552}
            width={256}
            alt=""
            className="rounded-xl"
          />
          <div className="flex items-center space-x-3 space-y-0">
            <FormControl>
              <RadioGroupItem
                value="card"
                id="card"
                aria-label="card template"
                className="size-5 border-primary shadow-none data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              />
            </FormControl>
            <FormLabel className="font-normal" htmlFor="card">
              Card
            </FormLabel>
          </div>
        </FormItem>
      </RadioGroup> */}
    </>
  );
};
