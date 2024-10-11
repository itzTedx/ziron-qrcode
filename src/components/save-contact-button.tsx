"use client";

import { Button } from "@/components/ui/button";
import { Person } from "@/types";

interface SaveContactButtonProps {
  data: Person;
}

export default function SaveContactButton({ data }: SaveContactButtonProps) {
  const generateVCard = () => {
    const vCardData = `
        BEGIN:VCARD
        VERSION:3.0
        FN:${data.name}
        EMAIL:${data.email}
        TEL:${data.phone}
        ADR:${data.address}
        END:VCARD
        `;
    return vCardData;
  };

  const downloadVCard = () => {
    const vCardData = generateVCard();
    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `${data.name} - ${data.company.name}.vcf`;
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
