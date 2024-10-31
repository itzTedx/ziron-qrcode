"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Globe,
  GripVertical,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { platformIcons } from ".";

const SortableItem = ({
  id,
  item,
}: {
  id: string;
  item: { label: string; url: string; icon: string }; // Adjusted type for item
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
          {platformIcons[item.icon as keyof typeof platformIcons] || (
            <Globe className="h-8 w-8" />
          )}
          <div className="ml-2 flex-grow">
            <div className="font-semibold">{item.label}</div>
            <Input
              type="text"
              placeholder="URL"
              value={item.url}
              className="mt-1"
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

export default SortableItem;
