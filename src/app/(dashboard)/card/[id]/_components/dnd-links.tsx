"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { IconGripVertical, IconPlus, IconTrash } from "@tabler/icons-react";
import { Reorder } from "framer-motion";
import { useFieldArray, useFormContext } from "react-hook-form";

import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LINKS } from "@/constants";
import { zCardSchema } from "@/types/card-schema";

interface Props {
  loading: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const DndLinks = ({ loading, open, setOpen }: Props) => {
  const form = useFormContext<zCardSchema>();
  const [active, setActive] = useState(0);

  const dragRef = useRef<HTMLDivElement>(null);

  const { fields, append, remove, move } = useFieldArray({
    name: "links",
    control: form.control,
  });

  return (
    <>
      <div className="flex flex-col gap-8 pt-3" ref={dragRef}>
        <Reorder.Group
          as="div"
          className="w-full space-y-4"
          values={fields}
          onReorder={(e) => {
            const activeEl = fields[active];
            e.map((item, index) => {
              if (item === activeEl) {
                move(active, index);
                setActive(index);
                return;
              }
              return;
            });
          }}
        >
          {fields.map((data, index) =>
            data.category === "General" ? (
              <Reorder.Item
                as="div"
                id={data.id}
                dragConstraints={dragRef}
                onDragStart={() => setActive(index)}
                value={data}
                key={data.id}
              >
                <Card className="flex items-center justify-between gap-2 p-4">
                  <div className="grid grid-cols-5 items-center gap-4">
                    <FormField
                      control={form.control}
                      name={`links.${index}.label`}
                      render={({ field }) => (
                        <FormItem className="col-span-2 flex gap-3 space-y-0">
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
                        <FormItem className="col-span-3">
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
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <IconTrash size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Drag to Re-Order"
                    className="text-gray-400 hover:bg-transparent hover:text-foreground"
                    onClick={(e) => e.preventDefault()}
                  >
                    <IconGripVertical size={16} />
                  </Button>
                </Card>
              </Reorder.Item>
            ) : (
              <Reorder.Item
                as="div"
                id={data.id}
                onDragStart={() => setActive(index)}
                value={data}
                dragConstraints={dragRef}
                key={data.id}
              >
                <Card
                  key={data.id}
                  className="flex items-center justify-between gap-2 p-4"
                >
                  <div className="flex flex-1 gap-3">
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <IconTrash size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Drag to Re-Order"
                    className="text-gray-400 hover:bg-transparent hover:text-foreground"
                    onClick={(e) => e.preventDefault()}
                  >
                    <IconGripVertical size={16} />
                  </Button>
                </Card>
              </Reorder.Item>
            )
          )}
        </Reorder.Group>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="h-12 w-full">
            <IconPlus size={16} className="mr-2" /> Add
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl p-0">
          <AlertDialogHeader className="border-b p-6">
            <DialogTitle>Add Link</DialogTitle>
            <DialogDescription className="sr-only">
              Add Social or custom links to digital card
            </DialogDescription>
          </AlertDialogHeader>
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
                          onClick={() =>
                            append({
                              category: item.label,
                              label: link.label,
                              url: link.url,
                              icon: link.icon,
                            })
                          }
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
        </DialogContent>
      </Dialog>
      <section>
        <div className="flex items-center justify-between">
          <h3>Suggestions</h3>
          <Button
            variant="link"
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
          {LINKS.map((item) =>
            item.links.slice(0, 4).map((link) => (
              <Card
                key={link.id}
                onClick={() =>
                  append({
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
                <p className="mt-1 whitespace-nowrap text-sm font-medium">
                  {link.label}
                </p>
              </Card>
            ))
          )}
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
