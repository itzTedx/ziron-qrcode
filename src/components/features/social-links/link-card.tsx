import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddLinkModal } from "@/store/use-add-link-modal";
import { cardSchema } from "@/types/card-schema";

interface LinkCardProps {
  data: {
    label?: string;
    url?: string;
    icon?: string;
    category?: string;
    id?: string;
  };
  index: number;
}

export default function LinkCard({ data, index }: LinkCardProps) {
  const { openModal } = useAddLinkModal();

  const { control } = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      links: [{ url: data.url || "" }],
    },
    mode: "onChange",
  });

  const { remove } = useFieldArray({
    control,
    name: "links",
  });

  const handleEdit = () => {
    openModal(index);
  };

  return (
    <Card className="flex items-center justify-between gap-4 p-4">
      <div className="flex flex-1 items-center gap-4">
        <Image src={data.icon!} height={40} width={40} alt="" />
        <FormField
          control={control}
          name={`links.${index}.url`}
          render={({ field }) => (
            <FormItem className="w-full space-y-0">
              <FormLabel className="sr-only">{data.label}</FormLabel>
              <FormControl>
                <Input placeholder={`${data.label} link`} {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="space-x-2">
        <Button size="icon" variant="ghost" onClick={handleEdit}>
          <IconEdit className="size-5" />
        </Button>
        <Button
          size="icon"
          onClick={() => remove(parseInt(data.id!))}
          variant="ghost"
          className="hover:bg-red-500 hover:text-red-100"
        >
          <IconTrash className="size-5" />
        </Button>
      </div>
    </Card>
  );
}
