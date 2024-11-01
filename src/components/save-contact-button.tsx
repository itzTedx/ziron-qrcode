"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Person } from "@/types";

interface SaveContactButtonProps {
  data: Person;
  imageBase64?: string;
  className?: string;
}

export default function SaveContactButton({
  data,
  imageBase64,
  className,
}: SaveContactButtonProps) {
  const generateVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
N:${data.name.replace(/\s+/g, ";")}
ORG:${data.company && data.company.name}
TITLE:${data.designation && data.designation}
TEL;MEDIATYPE=WORK:${data.phone && data.phone.replace(/\s+/g, "")}
EMAIL:${data.email && data.email}
ADR:${data.address && data.address}
PHOTO;ENCODING=BASE64;JPEG:${imageBase64}
END:VCARD`;
    return vCardData;
  };

  const downloadVCard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const vCardData = generateVCard();
    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `${data.name} - ${data.company?.name}.vcf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button className={cn("w-full", className)} onClick={downloadVCard}>
      Add Contact
    </Button>
  );
}
