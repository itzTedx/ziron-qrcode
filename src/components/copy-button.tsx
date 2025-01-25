"use client";

import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const CopyButton = ({ link }: { link: string }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <div className="flex items-center overflow-hidden rounded-full border border-input p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <p className="max-w-[25ch] overflow-hidden text-ellipsis whitespace-nowrap pl-4 pr-2 text-sm">
        {link}
      </p>
      <Button
        size="icon"
        className="rounded-full bg-foreground text-background *:size-4 hover:bg-foreground/80"
        onClick={() => copyToClipboard(link)}
        type="button"
      >
        {isCopied ? <Check /> : <Copy />}
      </Button>
    </div>
  );
};

export default CopyButton;
