"use client";

import Image from "next/image";
import React from "react";

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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  Twitter,
} from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cardSchema } from "@/types/card-schema";

import AddLinkModal from "./add-link-modal";
import SortableItem from "./sortable-item";

type CardFormValues = z.infer<typeof cardSchema> & {
  links: {
    label: string;
    url: string;
    icon: string;
    id?: string;
    category?: string;
  }[]; // Ensure links is always an array of the correct type
};

export const platformIcons: { [key: string]: React.ReactNode } = {
  Facebook: <Facebook className="h-6 w-6 text-blue-600" />,
  Twitter: <Twitter className="h-6 w-6" />,
  Instagram: <Instagram className="h-6 w-6" />,
  LinkedIn: <Linkedin className="h-6 w-6 text-blue-700" />,
  Whatsapp: (
    <Image
      src="/placeholder.svg?height=24&width=24"
      width={24}
      height={24}
      alt="Whatsapp"
    />
  ),
  Tiktok: (
    <Image
      src="/placeholder.svg?height=24&width=24"
      width={24}
      height={24}
      alt="Tiktok"
    />
  ),
  Messenger: <MessageCircle className="h-6 w-6 text-blue-500" />,
  Custom: <Globe className="h-6 w-6" />,
};

export default function CardForm() {
  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      companyId: 1, // Set a default value for companyId
      links: [],
    },
  });

  const { fields, append, move } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over?.id);
      move(oldIndex, newIndex);
    }
  };

  const onSubmit = (data: CardFormValues) => {
    console.log(data);
  };

  const handleAddLink = (platform: string) => {
    append({
      id: Date.now().toString(),
      label: platform,
      url: "",
      icon: platform,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-semibold">Links</h3>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((item) => (
                <SortableItem key={item.id} id={item.id} item={item} />
              ))}
            </SortableContext>
          </DndContext>

          <AddLinkModal onAddLink={handleAddLink} />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
