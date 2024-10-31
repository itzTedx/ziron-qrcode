// Function to convert image URL to Base64
export function imageToBase64(src: string): Promise<string> {
  return fetch(src)
    .then((response) => response.blob())
    .then((blob) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });
}
