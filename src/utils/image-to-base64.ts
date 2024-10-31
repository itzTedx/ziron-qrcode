// Function to convert image URL to Base64
export async function imageToBase64(src: string): Promise<string> {
  const response = await fetch(src);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return base64;
}
