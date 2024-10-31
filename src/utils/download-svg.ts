export const downloadSVG = (svg: SVGSVGElement | null, cardName: string) => {
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
