import Image from "next/image";

import { IconPlus } from "@tabler/icons-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LINKS } from "@/constants";
import { useAddLinkModal } from "@/store/use-add-link-modal";
import { cardSchema } from "@/types/card-schema";

type Link = {
  title: string;
  href: string;
  icon: string;
};

export default function AddLinkModal() {
  const { control } = useFormContext<z.infer<typeof cardSchema>>();

  const { append } = useFieldArray({
    control,
    name: "links",
  });

  const { isOpen, closeModal, index } = useAddLinkModal();
  console.log("edit-mode", index);

  const handleLinkAdd = (link: Link) => {
    if (index && index > 0) {
      console.log("edit-mode", index);
    }
    append({
      id: Date.now().toString(),
      label: link.title,
      href: link.href,
      icon: link.icon,
    });

    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="border-b p-6">
          <DialogTitle>Add Link</DialogTitle>
          <DialogDescription className="sr-only">
            Add Social or custom links to digital card
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pb-6 pt-0">
          {LINKS.map((item, i) => (
            <div key={i} className="py-3">
              <h4 className="pb-2 text-sm font-medium text-gray-700">
                {item.label}
              </h4>

              <div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-x-6">
                {item.links.map((link, i) => (
                  <div
                    className="flex items-center justify-between border-b py-3"
                    key={`addLink-${i}-${link.title}`}
                  >
                    <div className="flex items-center gap-4 font-medium">
                      <div className="relative size-8">
                        <Image src={link.icon} fill alt="" />
                      </div>
                      {/* <span className="size-8 bg-red-500" /> */}
                      <p>{link.title}</p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => handleLinkAdd(link)}
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
