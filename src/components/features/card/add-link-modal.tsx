import { Globe } from "lucide-react";

import { socialPlatforms } from "@/app/(dashboard)/company/sortable-item";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

export default AddLinkModal;
