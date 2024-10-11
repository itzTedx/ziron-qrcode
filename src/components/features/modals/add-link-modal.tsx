import { IconPlus } from "@tabler/icons-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LINKS } from "@/constants";
import { useAddLinkModal } from "@/store/use-add-link-modal";
import { cardSchema } from "@/types/card-schema";

export default function AddLinkModal() {
  const { control } = useFormContext<z.infer<typeof cardSchema>>();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "links",
  });

  const { isOpen, closeModal } = useAddLinkModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="border-b p-6">
          <DialogTitle>Add Link</DialogTitle>
        </DialogHeader>
        <div className="p-6 pb-6 pt-0">
          {LINKS.map((item, index) => (
            <div key={index} className="py-3">
              <h4 className="pb-2 text-sm font-medium text-gray-700">
                {item.label}
              </h4>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-x-6">
                {item.links.map((link) => (
                  <div className="flex items-center justify-between border-b py-3">
                    <div className="flex items-center gap-3 font-medium">
                      <link.icon />
                      {/* <span className="size-8 bg-red-500" /> */}
                      <p>{link.title}</p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        append({
                          label: link.title,
                          href: link.href,
                          icon: link.icon,
                        })
                      }
                      className="h-8 gap-2 px-2 font-semibold text-primary hover:text-blue-800"
                    >
                      <IconPlus className="size-3 stroke-[2.5]" /> Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
