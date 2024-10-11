"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { IconBrandFacebook, IconPlus } from "@tabler/icons-react";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAddLinkModal } from "@/store/use-add-link-modal";
import { cardSchema } from "@/types/card-schema";

export default function SocialMediaLinks() {
  const { control } = useFormContext<z.infer<typeof cardSchema>>();

  const openModal = useAddLinkModal((state) => state.openModal);

  const { fields, append, remove, move } = useFieldArray({
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
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${snapshot.isDragging ? "opacity-50" : ""}`}
                    >
                      <Card>
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-4">
                            <IconBrandFacebook className="size-9 text-blue-600" />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {field.label || "Unnamed Link"}
                              </span>
                              <a
                                href={field.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:underline"
                              >
                                {field.href || "No URL set"}
                              </a>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              aria-label="Delete link"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              {...provided.dragHandleProps}
                              aria-label="Drag to reorder"
                            >
                              <MoreVertical className="h-4 w-4" />
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
