"use client";

import { useState } from "react";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  IconBrandFacebook,
  IconEdit,
  IconGripVertical,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { cardSchema } from "@/types/card-schema";

type SocialLink = {
  id: string;
  name: string;
};

export default function LinksDND() {
  const [links, setLinks] = useState<SocialLink[]>([
    { id: "1", name: "Facebook" },
  ]);

  const { getValues, control, setError } =
    useFormContext<z.infer<typeof cardSchema>>();

  const { fields, remove, append, update, move } = useFieldArray({
    control,
    name: "links",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newLinks = Array.from(links);
    const [reorderedItem] = newLinks.splice(result.source.index, 1);
    newLinks.splice(result.destination.index, 0, reorderedItem);

    setLinks(newLinks);
  };

  return (
    <FormField
      control={control}
      name="links"
      render={() => (
        <FormItem>
          <FormControl>
            <div className="w-full">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="list">
                  {(provided) => (
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {fields.map((link, i) => (
                        <Draggable
                          key={link.id}
                          draggableId={link.id}
                          index={i}
                        >
                          {(provided, snapshot) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`${snapshot.isDragging ? "opacity-50" : ""}`}
                            >
                              <Card>
                                <CardContent className="flex items-center justify-between p-4">
                                  <div className="flex items-center space-x-2">
                                    <IconBrandFacebook className="h-5 w-5 text-blue-600" />
                                    <span>{link.href}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Button variant="ghost" size="smallIcon">
                                      <IconEdit className="size-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="smallIcon"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        remove(i);
                                      }}
                                      aria-label="Delete link"
                                    >
                                      <IconTrash className="size-4 text-red-600" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="smallIcon"
                                      className="text-gray-400 hover:bg-transparent hover:text-gray-500 active:text-gray-700"
                                      {...provided.dragHandleProps}
                                      aria-label="Drag to reorder"
                                    >
                                      <IconGripVertical className="size-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
              <Button
                onClick={() => append({ label: "", href: "" })}
                variant="outline"
                className="mt-4 h-12 w-full gap-2"
              >
                <IconPlus className="size-4" /> Add Link
              </Button>
            </div>
          </FormControl>

          {/* <FormMessage /> */}
        </FormItem>
      )}
    />
  );
}
