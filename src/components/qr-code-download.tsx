import { useRef, useState } from "react";

import { IconCopy, IconDownload } from "@tabler/icons-react";
import { QRCodeSVG } from "qrcode.react";

import { Button } from "@/components/ui/button";
import { downloadSVG } from "@/utils/download-svg";
import { imageToBase64 } from "@/utils/image-to-base64";

import { ShimmerDots } from "./ui/shimmer-dots";

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h5>QR Code Preview</h5>
        <div className="flex gap-3">
          <Button
            className="w-full"
            variant="ghost"
            size="icon"
            onClick={handleDownload}
          >
            <IconDownload />
          </Button>
          <Button variant="ghost" size="icon" onClick={onBack}>
            <IconCopy />
          </Button>
        </div>
      </div>
      <div className="relative flex items-center justify-center gap-6 rounded-lg border bg-gray-50 p-9">
        <ShimmerDots className="opacity-30 [mask-image:radial-gradient(40%_80%,transparent_50%,black)]" />
        <QRCodeSVG
          ref={svgRef}
          value={shareLink}
          size={136}
          imageSettings={{
            src: imageData,
            height: 32,
            width: 32,
            excavate: true,
          }}
        />
      </div>
    </div>
  );
}
