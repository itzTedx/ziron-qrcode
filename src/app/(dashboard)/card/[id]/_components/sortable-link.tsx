"use client";

import Image from "next/image";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical } from "@tabler/icons-react";
import { Edit2, Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddLinkModal } from "@/store/use-add-link-modal";
import { Link } from "@/types";
import { cardSchema } from "@/types/card-schema";

interface SortableLinkCardProps {
  id: number;
  onDelete: (id: number) => void;
  data: Link;
}

export default function SortableLinkCard({
  id,
  onDelete,
  data,
}: SortableLinkCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { control, register } = useFormContext<z.infer<typeof cardSchema>>();

  const openModal = useAddLinkModal((state) => state.openModal);

  const handleDelete = () => {
    onDelete(id);
  };

  const isCursorGrabbing = attributes["aria-pressed"];
  return (
    <div ref={setNodeRef} style={style} key={id}>
      <Card className="group relative flex justify-between gap-5 p-4">
        <div className="flex w-full items-center gap-x-4">
          <div className="relative size-12 flex-shrink-0">
            <Image src={data.icon} fill alt="" sizes="100vw" />
          </div>

          {data.category === "General" ? (
            <div className="flex w-full gap-4">
              <Label className="">
                <h5 className="pb-1">
                  Title
                  <span className="text-red-500">*</span>
                </h5>
                <Input
                  {...register(`links.${id}.label`)}
                  name={`links.[${id}].label`}
                  placeholder="Enter Link Title"
                />
              </Label>
              <Label className="w-full">
                <h5 className="pb-1">
                  URL <span className="text-red-500">*</span>
                </h5>
                <Input
                  placeholder="https://"
                  type="url"
                  {...register(`links.${id}.url`)}
                  name={`links.[${id}].value`}
                />
              </Label>
            </div>
          ) : (
            <Label className="flex w-full flex-col">
              <h5 className="pb-1 text-xs text-gray-600">{data.label}</h5>
              <Input
                {...register(`links.${id}.url`)}
                name={`links.[${id}].value`}
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
            tabIndex={-1}
            onClick={(e) => {
              e.preventDefault();
              openModal(id);
            }}
          >
            <Edit2 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="smallIcon"
            tabIndex={-1}
            onClick={handleDelete}
            aria-label="Delete link"
          >
            <Trash2 className="size-4 text-red-500" />
          </Button>
          <Button
            variant="ghost"
            className="hover:bg-transparent"
            size="icon"
            {...attributes}
            {...listeners}
            aria-describedby={`DndContext-${id}`}
            aria-label="Drag to reorder"
          >
            <IconGripVertical className="size-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
