export function convertSvgToPng(svg: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Failed to get canvas context"));
      return;
    }

    // Create a temporary DOM element to parse the SVG and get dimensions
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = svg;
    const svgElement = tempDiv.querySelector("svg");

    if (!svgElement) {
      reject(new Error("Invalid SVG"));
      return;
    }

    // Get width and height from the SVG's viewBox or default to 100x100
    const viewBox = svgElement.getAttribute("viewBox");
    let width = 100;
    let height = 100;

    if (viewBox) {
      const viewBoxValues = viewBox.split(" ").map(Number);
      width = viewBoxValues[2] || width; // width from viewBox
      height = viewBoxValues[3] || height; // height from viewBox
    }

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to convert canvas to Blob"));
        }
      }, "image/png");
    };

    img.onerror = (error) => {
      reject(new Error(`Failed to load SVG image: ${error}`));
    };

    img.src = `data:image/svg+xml;base64,${btoa(svg)}`;
  });
}
