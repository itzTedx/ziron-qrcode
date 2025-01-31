import { IconTrash } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

interface Props {
  isEditMode: boolean;
  disabled: boolean;
}

export const ActionButtons = ({ isEditMode, disabled }: Props) => {
  return (
    <div className="fixed bottom-0 w-full bg-background/50 px-6 py-4 backdrop-blur-md md:hidden">
      {isEditMode ? (
        <div className="flex gap-3">
          <Button type="submit" className="w-full" disabled={disabled}>
            Save Changes
          </Button>
          <Button
            type="submit"
            variant="destructive"
            className="flex-shrink-0"
            size="icon"
            disabled={disabled}
          >
            <IconTrash className="size-4" />
          </Button>
        </div>
      ) : (
        <Button type="submit" className="w-full" disabled={disabled}>
          Create Card
        </Button>
      )}
    </div>
  );
};
