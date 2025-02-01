export function getAbsoluteUrl(imagePath: string, baseUrl: string) {
  // If it's already an absolute URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Ensure baseUrl has a trailing slash
  if (!baseUrl.endsWith("/")) {
    baseUrl += "/";
  }

  // Remove leading slash from imagePath if present
  if (imagePath.startsWith("/")) {
    imagePath = imagePath.substring(1);
  }

  return new URL(imagePath, baseUrl).href;
}
