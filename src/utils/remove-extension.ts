// Function to remove specified extensions from a filename
export function removeExtension(
  filename: string | undefined
): string | undefined {
  return filename?.replace(/\.(pdf|jpeg|jpg|png|svg|doc|docx)$/, "");
}
