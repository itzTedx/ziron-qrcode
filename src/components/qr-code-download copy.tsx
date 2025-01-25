import { useRef, useState } from "react";

import { QRCodeSVG } from "qrcode.react";

import { Button } from "@/components/ui/button";
import { downloadSVG } from "@/utils/download-svg";
import { imageToBase64 } from "@/utils/image-to-base64";

// Import the new function

interface QRCodeDownloadProps {
  shareLink: string;
  data: { url: string; name: string; logo?: string };
  cardName: string;
  onBack?: () => void;
}

export default function QRCodeDownload({
  data,
  shareLink,
  cardName,
  onBack,
}: QRCodeDownloadProps) {
  const [imageData, setImageData] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);

  imageToBase64(data.logo!).then((img) => {
    setImageData(img);
  });

  const handleDownload = () => {
    downloadSVG(svgRef.current, cardName);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-9 pb-9 pt-3">
      <QRCodeSVG
        ref={svgRef}
        value={shareLink}
        size={256}
        imageSettings={{
          src: imageData,
          height: 40,
          width: 40,
          excavate: true,
        }}
      />
      <div className="flex w-full flex-col gap-3">
        <Button className="w-full" onClick={handleDownload}>
          Download
        </Button>
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
