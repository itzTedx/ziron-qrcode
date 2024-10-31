"use client";

import Image from "next/image";
import React, { useState } from "react";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Facebook,
  Globe,
  GripVertical,
  Instagram,
  Linkedin,
  MessageCircle,
  MoreVertical,
  Pencil,
  Trash2,
  Twitter,
} from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type LinkItem = {
  id: string;
  platform: string;
  username: string;
};

const platformIcons: { [key: string]: React.ReactNode } = {
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

const socialPlatforms = [
  { name: "Instagram", icon: platformIcons["Instagram"] },
  { name: "Facebook", icon: platformIcons["Facebook"] },
  { name: "Whatsapp", icon: platformIcons["Whatsapp"] },
  { name: "Twitter", icon: platformIcons["Twitter"] },
  { name: "Tiktok", icon: platformIcons["Tiktok"] },
  { name: "LinkedIn", icon: platformIcons["LinkedIn"] },
  { name: "Messenger", icon: platformIcons["Messenger"] },
];

const SortableItem = ({
  id,
  item,
}: {
  id: string;
  item: LinkItem;
  index: number;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="mb-4">
        <CardContent className="flex items-center p-4">
          <GripVertical className="mr-2 cursor-move" />
          {platformIcons[item.platform] || <Globe className="h-8 w-8" />}
          <div className="ml-2 flex-grow">
            <div className="font-semibold">{item.platform}</div>
            <Input
              type="text"
              placeholder="Username"
              value={item.username}
              className="mt-1"
              readOnly
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AddLinkModal = ({
  onAddLink,
}: {
  onAddLink: (platform: string) => void;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4 w-full">+ Add Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Link</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-medium text-gray-500">General</h3>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
            <div className="flex items-center">
              <Globe className="mr-3 h-6 w-6" />
              <span className="font-medium">Custom Link</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
              onClick={() => onAddLink("Custom")}
            >
              + Add
            </Button>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-medium text-gray-500">Socials</h3>
          <div className="space-y-2">
            {socialPlatforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
              >
                <div className="flex items-center">
                  {platform.icon}
                  <span className="ml-3 font-medium">{platform.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-indigo-600 hover:bg-indigo-50"
                  onClick={() => onAddLink(platform.name)}
                >
                  + Add
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function Component() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { control, handleSubmit } = useForm<{ links: LinkItem[] }>({
    defaultValues: {
      links: [
        { id: "1", platform: "Facebook", username: "" },
        { id: "2", platform: "Twitter", username: "" },
        { id: "3", platform: "Instagram", username: "" },
      ],
    },
  });

  const { fields, append, move } = useFieldArray({
    control,
    name: "links",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const onSubmit = (data: { links: LinkItem[] }) => {
    console.log(data);
  };

  const handleAddLink = (platform: string) => {
    append({ id: Date.now().toString(), platform, username: "" });
    setIsDialogOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
          {fields.map((item, index) => (
            <SortableItem
              key={item.id}
              id={item.id}
              item={item}
              index={index}
            />
          ))}
        </SortableContext>
      </DndContext>

      <AddLinkModal onAddLink={handleAddLink} />

      <Button type="submit" className="mt-4 w-full">
        Save
      </Button>
    </form>
  );
}
