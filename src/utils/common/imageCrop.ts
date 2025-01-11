

export default async function getCroppedImg(
  imageSrc: string,
  croppedAreaPixels: { x: number; y: number; width: number; height: number }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not found.'));
        return;
      }

      // Set canvas dimensions to match cropped area
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      // Draw the cropped image onto the canvas
      ctx.drawImage(
        image,
        croppedAreaPixels.x, // Start x of crop
        croppedAreaPixels.y, // Start y of crop
        croppedAreaPixels.width, // Width of crop
        croppedAreaPixels.height, // Height of crop
        0,
        0,
        croppedAreaPixels.width, // Draw width on canvas
        croppedAreaPixels.height // Draw height on canvas
      );

      // Convert canvas to a data URL
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob from canvas'));
          return;
        }
        const croppedImageUrl = URL.createObjectURL(blob);
        resolve(croppedImageUrl);
      }, 'image/jpeg');
    };

    image.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });
}