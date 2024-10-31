import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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

import LinkCard from "./link-card";

export default function SocialLinks() {
  const { openModal } = useAddLinkModal();

  const handleModalOpen = () => {
    openModal();
  };

  const { control } = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    mode: "onChange",
  });

  const { remove, fields } = useFieldArray({
    control,
    name: "links",
  });

  //   const { links } = useWatch<z.infer<typeof cardSchema>>();

  return (
    <div className="space-y-4">
      {fields.map((link, i) =>
        link.category === "General" ? (
          <div key={`link-general-${i}`} className="flex justify-between">
            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={control}
                name={`links.${i}.label`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Custom title" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`links.${i}.url`}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Custom Link" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="">
              <Button onClick={() => remove(i)}>
                <IconTrash />
              </Button>
            </div>
          </div>
        ) : (
          <LinkCard key={`link-${link.category}-${i}`} data={link} index={i} />
        )
      )}
      <Button
        variant="outline"
        className="mt-4 h-12 w-full gap-2"
        onClick={handleModalOpen}
      >
        <IconPlus className="size-4" />
        Add Link
      </Button>
    </div>
  );
}
