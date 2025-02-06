"use client";

import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

const CopyButton = ({ link }: { link: string }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <div
      className={cn(
        "flex items-center overflow-hidden rounded-full border border-input bg-background p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:outline-none active:ring-2 active:ring-ring active:ring-offset-2"
      )}
    >
      <p className="overflow-hidden truncate text-ellipsis whitespace-nowrap pl-2 pr-2 text-[10px] md:pl-4 md:text-sm lg:max-w-[25ch]">
        {link}
      </p>
      <Button
        size="icon"
        className="shrink-0 rounded-full bg-foreground text-background *:size-4 hover:bg-foreground/80"
        onClick={() => copyToClipboard(link)}
        type="button"
      >
        {isCopied ? <Check /> : <Copy />}
      </Button>
    </div>
  );
};

export default CopyButton;
