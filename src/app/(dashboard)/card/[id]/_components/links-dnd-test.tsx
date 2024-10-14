"use client";

import Image from "next/image";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { IconGripVertical, IconPlus } from "@tabler/icons-react";
import { Edit2, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddLinkModal } from "@/store/use-add-link-modal";
import { cardSchema } from "@/types/card-schema";

export default function SocialMediaLinks() {
  const { control } = useFormContext<z.infer<typeof cardSchema>>();

  const openModal = useAddLinkModal((state) => state.openModal);

  const { fields, remove, move } = useFieldArray({
    control,
    name: "links",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    move(result.source.index, result.destination.index);
  };

  const handleAddLink = () => {
    // append({ id: Date.now().toString(), label: "", href: "" });
    openModal();
  };

  return (
    <div className="w-full">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {fields.map((field, index) => (
                <Draggable
                  key={`Dnd-${field.id}-${index}`}
                  draggableId={field.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${snapshot.isDragging ? "opacity-50" : ""}`}
                    >
                      <Card>
                        <CardContent className="flex items-center justify-between gap-6 p-4">
                          <div className="flex w-full items-center gap-x-4">
                            <div className="relative size-12 flex-shrink-0">
                              <Image src={field.icon} fill alt="" />
                            </div>

                            {field.label === "Custom Link" ? (
                              <div className="flex w-full gap-4">
                                <Label className="w-full">
                                  <h5 className="pb-1">
                                    Title
                                    <span className="text-red-500">*</span>
                                  </h5>
                                  <Input
                                    name={`links.[${index}].value`}
                                    placeholder="Enter Link Title"
                                  />
                                </Label>
                                <Label className="w-full">
                                  <h5 className="pb-1">
                                    URL <span className="text-red-500">*</span>
                                  </h5>
                                  <Input placeholder="https://" />
                                </Label>
                              </div>
                            ) : (
                              <Label className="flex w-full flex-col">
                                <h5 className="pb-1 text-xs text-gray-600">
                                  {field.label}
                                </h5>
                                <Input
                                  placeholder="Username"
                                  className="w-full"
                                />
                              </Label>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="smallIcon"
                              onClick={() => openModal(index)}
                            >
                              <Edit2 className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="smallIcon"
                              onClick={() => remove(index)}
                              aria-label="Delete link"
                            >
                              <Trash2 className="size-4 text-red-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              className="hover:bg-transparent"
                              size="icon"
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
        onClick={handleAddLink}
        variant="outline"
        className="mt-4 h-12 w-full gap-2"
      >
        <IconPlus className="mr-2 h-4 w-4" />
        Add Link
      </Button>
    </div>
  );
}
