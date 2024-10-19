"use client";

import { useState } from "react";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { IconPlus } from "@tabler/icons-react";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { useAddLinkModal } from "@/store/use-add-link-modal";
import { Link } from "@/types";
import { cardSchema } from "@/types/card-schema";

import SortableLinkCard from "./sortable-link";

export default function SocialMediaLinks() {
  const [items, setItems] = useState<Link[]>([]);

  const { control } = useFormContext<z.infer<typeof cardSchema>>();

  const { openModal, setData, data } = useAddLinkModal();

  // Use useWatch to observe changes in the links array
  const links = useWatch({
    control,
    name: "links",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.id === active.id);
        const newIndex = over
          ? prevItems.findIndex((item) => item.id === over.id)
          : oldIndex;

        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  }

  function handleDelete(idToDelete: number) {
    setItems((prevItems) => prevItems.filter((item) => item.id !== idToDelete));
  }

  const handleAddLink = () => {
    openModal();

    setItems((prevItems) => [...prevItems, data[0] as Link]); // Ensure data is treated as a single Link

    console.log("data from modal", data);
  };

  return (
    <div className="w-full space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {links &&
            links.map((item) => {
              const data = { ...item, id: parseInt(item.id!) };
              return (
                <SortableLinkCard
                  key={item.id}
                  id={parseInt(item.id!)}
                  onDelete={handleDelete}
                  data={data}
                />
              );
            })}
        </SortableContext>
      </DndContext>

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
