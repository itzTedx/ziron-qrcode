"use client";

import { Button } from "@/components/ui/button";
import { Person } from "@/types";

interface SaveContactButtonProps {
  data: Person;
}

export const phone = `BEGIN:VCARD
VERSION:3.0
N:(itzTedx);Melwin;Af
ORG:
TITLE:
TEL;MEDIATYPE=WORK:+9715881012324
TEL;MEDIATYPE=WORK:+423432
EMAIL:melwinaf.abi@gmail.com
ADR:dsdg3 424 
END:VCARD`;

export default function SaveContactButton({ data }: SaveContactButtonProps) {
  const generateVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
N:${data.name.replace(/\s+/g, ";")}
ORG:${data.company && data.company.name}
TITLE:${data.designation && data.designation}
TEL;MEDIATYPE=WORK:${data.phone && data.phone.replace(/\s+/g, "")}
EMAIL:${data.email && data.email}
ADR:${data.address && data.address}
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
    <Button className="w-full" onClick={downloadVCard}>
      Add Contact
    </Button>
  );
}
