"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Person } from "@/types";

interface SaveContactButtonProps {
  style?: React.CSSProperties;
  data: Person;
  imageBase64?: string;
  className?: string;
}

export default function SaveContactButton({
  style,
  data,
  imageBase64,
  className,
}: SaveContactButtonProps) {
  // N:${data.name.replace(/\s+/g, ";")}
  const generateVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${data.name}
ORG:${data.company && data.company.name}
TITLE:${data.designation && data.designation}
${
  data.phones &&
  data.phones.map(
    (phone) =>
      `TEL;MEDIATYPE=WORK:${phone.phone && phone.phone.replace(/\s+/g, "")}`
  )
}
${data.emails && data.emails.map((email) => `EMAIL:${email.email && email.email}`)}
ADR:${data.address && data.address}
PHOTO;ENCODING=BASE64;JPEG:${imageBase64}
LOGO;TYPE=SVG;VALUE=URI:${data.company && data.company.logo}
NOTE:${data.bio}
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
    <Button
      className={cn("w-full", className)}
      onClick={downloadVCard}
      style={style}
    >
      Add Contact
    </Button>
  );
}
