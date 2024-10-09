import { useRef } from "react";

import { QRCodeSVG } from "qrcode.react";

import { Button } from "@/components/ui/button";

interface QRCodeDownloadProps {
  shareLink: string;
  logo: string;
  cardName: string;
  onBack: () => void; // Callback for the back button
}

export default function QRCodeDownload({
  shareLink,
  logo,
  cardName,
  onBack,
}: QRCodeDownloadProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const downloadSVG = () => {
    const svg = svgRef.current;

    if (svg) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);

      // Create a blob from the SVG string
      const blob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);

      // Create a download link and trigger it
      const link = document.createElement("a");
      link.href = url;
      link.download = `${cardName}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-9 pb-9 pt-3">
      <QRCodeSVG
        ref={svgRef}
        value={shareLink}
        size={256}
        imageSettings={{
          src: logo,
          height: 50,
          width: 50,
          opacity: 1,
          excavate: true,
        }}
      />
      <div className="flex w-full flex-col gap-3">
        <Button className="w-full" onClick={downloadSVG}>
          Download
        </Button>
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
