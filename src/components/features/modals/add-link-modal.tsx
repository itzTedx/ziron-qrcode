import Image from "next/image";

import { IconPlus } from "@tabler/icons-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";

import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { LINKS } from "@/constants";
import { useAddLinkModal } from "@/store/use-add-link-modal";
import { cardSchema } from "@/types/card-schema";

type Link = {
  id: number;
  label: string;
  url: string;
  icon: string;
  category?: string;
};

export default function AddLinkModal() {
  const { control } = useFormContext<z.infer<typeof cardSchema>>();

  const { append } = useFieldArray({
    control,
    name: "links",
  });

  const { isOpen, closeModal, index } = useAddLinkModal();

  const handleLinkAdd = (link: Link, category: string) => {
    append({
      id: link.id,
      label: link.label,
      url: link.url,
      icon: link.icon,
      category: category,
    });

    closeModal();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      closeModal={closeModal}
      title={typeof index === "number" ? "Edit Link" : "Add Link"}
      className="max-w-2xl"
    >
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
                  key={`addLink-${i}-${link.label}`}
                >
                  <div className="flex items-center gap-4 font-medium">
                    <div className="relative size-8">
                      <Image src={link.icon} fill alt="" sizes="10vw" />
                    </div>

                    <p>{link.label}</p>
                  </div>
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      onClick={() => handleLinkAdd(link, item.label)}
                      className="h-8 gap-2 px-2 font-semibold text-primary hover:text-blue-800"
                    >
                      <IconPlus className="size-3 stroke-[2.5]" />
                      Add
                    </Button>
                  </DialogClose>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ResponsiveModal>
  );
}
