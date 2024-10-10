import {
  IconBrandFacebook,
  IconEdit,
  IconGripVertical,
  IconTrash,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

export default function LinkCard() {
  return (
    <div className="flex w-full items-center justify-between rounded-md border bg-background p-4">
      <div className="flex gap-3 font-medium">
        <IconBrandFacebook /> Facebook
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-gray-600">
          <IconEdit />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-red-700"
        >
          <IconTrash />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-400">
          <IconGripVertical />
        </Button>
      </div>
    </div>
  );
}
