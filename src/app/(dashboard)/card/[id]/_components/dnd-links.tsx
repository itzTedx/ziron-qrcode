"use client";

import Image from "next/image";
import { memo, useCallback, useMemo, useRef, useState } from "react";

import { IconGripVertical, IconPlus, IconTrash } from "@tabler/icons-react";
import { Reorder } from "framer-motion";
import { useFieldArray, useFormContext } from "react-hook-form";

import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogClose } from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LINKS } from "@/constants";
import { Link } from "@/types";
import { zCardSchema } from "@/types/card-schema";

interface Props {
  loading: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface LinkItemProps {
  data: {
    category: string;
    label: string;
    url: string;
    icon: string;
    id?: string;
  };
  index: number;
  loading: boolean;
  onRemove: (index: number) => void;
  form: ReturnType<typeof useFormContext<zCardSchema>>;
}

// Memoized Link Item Component
const LinkItem = memo(
  ({ data, index, loading, onRemove, form }: LinkItemProps) => {
    const isGeneral = data.category === "General";

    return (
      <Card className="flex items-center justify-between gap-2 p-3 md:p-4">
        {isGeneral ? (
          <div className="grid w-full items-center gap-4 md:grid-cols-5">
            <FormField
              control={form.control}
              name={`links.${index}.label`}
              render={({ field }) => (
                <FormItem className="flex gap-2 space-y-0 md:col-span-2 md:gap-3">
                  <Image
                    src={data.icon}
                    height={40}
                    width={40}
                    alt=""
                    className="flex-shrink-0"
                  />
                  <FormControl>
                    <Input
                      className="space-y-0"
                      {...field}
                      disabled={loading}
                      placeholder={`${data.label} Title`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              key={data.id}
              name={`links.${index}.url`}
              render={({ field }) => (
                <FormItem className="md:col-span-3">
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      placeholder={`${data.label} Url`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : (
          <div className="flex flex-1 gap-2 md:gap-3">
            <Image src={data.icon} height={40} width={40} alt="" />
            <FormField
              control={form.control}
              key={data.id}
              name={`links.${index}.url`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      placeholder={`${data.label} url`}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <Button
          type="button"
          variant="ghost"
          className="shrink-0 text-destructive hover:text-destructive"
          size="smallIcon"
          onClick={() => onRemove(index)}
        >
          <IconTrash size={16} />
        </Button>
        <button
          type="button"
          title="Drag to Re-Order"
          className="text-gray-400 hover:bg-transparent hover:text-foreground"
          onClick={(e) => e.preventDefault()}
        >
          <IconGripVertical size={16} />
        </button>
      </Card>
    );
  }
);
LinkItem.displayName = "LinkItem";

// Memoized Suggestion Card
interface SuggestionCardProps {
  link: { label: string; url: string; icon: string; id?: string };
  item: { label: string };
  onAppend: (data: {
    category: string;
    label: string;
    url: string;
    icon: string;
  }) => void;
}

const SuggestionCard = memo(({ link, item, onAppend }: SuggestionCardProps) => (
  <Card
    onClick={() =>
      onAppend({
        category: item.label,
        label: link.label,
        url: link.url,
        icon: link.icon,
      })
    }
    className="flex flex-col items-center justify-between p-6 transition-colors hover:border-primary hover:bg-muted/20"
    role="button"
  >
    <Image src={link.icon} height={40} width={40} alt="" />
    <p className="mt-1 whitespace-nowrap text-sm font-medium">{link.label}</p>
  </Card>
));

SuggestionCard.displayName = "SuggestionCard";

export const DndLinks = ({ loading, open, setOpen }: Props) => {
  const form = useFormContext<zCardSchema>();
  const [active, setActive] = useState(0);
  const dragRef = useRef<HTMLDivElement>(null);

  const { fields, append, remove, move } = useFieldArray({
    name: "links",
    control: form.control,
  });

  // Memoize callbacks
  const handleAppend = useCallback(
    (data: { category: string; label: string; url: string; icon: string }) => {
      append(data);
    },
    [append]
  );

  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  const handleReorder = useCallback(
    (e: typeof fields) => {
      const activeEl = fields[active];
      e.forEach((item, index) => {
        if (item === activeEl) {
          move(active, index);
          setActive(index);
        }
      });
    },
    [active, fields, move]
  );

  // Memoize suggestions data
  const suggestionLinks = useMemo(
    () =>
      LINKS.map((item) =>
        item.links.slice(0, 4).map((link) => ({
          ...link,
          itemLabel: item.label,
        }))
      ).flat(),
    []
  );

  const handleLinkAdd = (link: Link, category: string) => {
    append({
      id: link.id,
      label: link.label,
      url: link.url,
      icon: link.icon,
      category: category,
    });

    setOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-8 pt-3" ref={dragRef}>
        <Reorder.Group
          as="div"
          className="w-full space-y-4"
          values={fields}
          onReorder={handleReorder}
        >
          {fields.map((data, index) => (
            <Reorder.Item
              as="div"
              id={data.id}
              dragConstraints={dragRef}
              onDragStart={() => setActive(index)}
              value={data}
              key={data.id}
            >
              <LinkItem
                data={{
                  category: data.category || "",
                  label: data.label || "",
                  url: data.url || "",
                  icon: data.icon || "",
                  id: data.id,
                }}
                index={index}
                loading={loading}
                onRemove={handleRemove}
                form={form}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
      <ResponsiveModal
        isOpen={open}
        closeModal={setOpen}
        title={"Add Link"}
        className="max-w-2xl"
        asChild
        trigger={
          <Button type="button" variant="outline" className="h-12 w-full">
            <IconPlus size={16} className="mr-2" /> Add
          </Button>
        }
      >
        <div className="p-6 pb-6 pt-0">
          {LINKS.map((item, i) => (
            <div key={i} className="py-3">
              <h4 className="pb-2 text-sm font-medium text-gray-700">
                {item.label}
              </h4>

              <div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-x-6">
                {item.links.map((link, i) => (
                  <div
                    className="flex items-center justify-between border-b py-3"
                    key={`addLink-${i}-${link.label}`}
                  >
                    <div className="flex items-center gap-4 font-medium">
                      <div className="relative size-8">
                        <Image src={link.icon} fill alt="" sizes="10vw" />
                      </div>

                      <p>{link.label}</p>
                    </div>
                    <DialogClose asChild>
                      <Button
                        variant="ghost"
                        onClick={() => handleLinkAdd(link, item.label)}
                        className="h-8 gap-2 px-2 font-semibold text-primary hover:text-blue-800"
                      >
                        <IconPlus className="size-3 stroke-[2.5]" />
                        Add
                      </Button>
                    </DialogClose>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ResponsiveModal>

      <section>
        <div className="flex items-center justify-between">
          <h3>Suggestions</h3>
          <Button
            variant="link"
            type="button"
            onClick={useCallback(() => {
              setOpen(true);
            }, [setOpen])}
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
          {suggestionLinks.map((link) => (
            <SuggestionCard
              key={link.id}
              link={{ ...link, id: link.id?.toString() }}
              item={{ label: link.itemLabel }}
              onAppend={handleAppend}
            />
          ))}
          <Card
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
            className="flex flex-col items-center justify-center text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-muted/20"
            role="button"
          >
            View More
          </Card>
        </div>
      </section>
    </>
  );
};
