import { useState } from "react";

import { toast } from "sonner";

export function useCopyToClipboard({
  timeout = 2000,
  onCopy,
}: {
  timeout?: number;
  onCopy?: () => void;
} = {}) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (value: string) => {
    if (typeof window === "undefined" || !navigator.clipboard.writeText) {
      return;
    }

    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      toast.success("Copied");

      if (onCopy) {
        onCopy();
      }

      setTimeout(() => {
        setIsCopied(false);
        toast.dismiss();
      }, timeout);
    }, console.error);
  };

  return { isCopied, copyToClipboard };
}
