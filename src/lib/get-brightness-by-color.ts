/**
 * Determines the text color (black or white) based on the background color for optimal contrast.
 * @param hexColor - The background color in hex format (e.g., "#RRGGBB").
 * @returns The appropriate text color as a hex string ("#000000" for black, "#FFFFFF" for white).
 */
function getTextColorByBackground(hexColor: string): string {
  // Remove the '#' if it exists
  const cleanHex = hexColor.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Calculate the relative luminance (using the WCAG formula)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  // Return black or white based on luminance threshold
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

export default getTextColorByBackground;
