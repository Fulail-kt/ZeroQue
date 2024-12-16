export const convertFileToBase64 = async (file: File): Promise<string> => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const output = await new Promise<string>((resolve, reject) => {
      reader.onload = function () {
        const output = reader.result?.toString();
        if (output) {
          resolve(output);
          reject("Error while convert the file into base64 format");
        }
      };
      reader.onerror = () => {
        reject("Error while convert the file into base64 format");
      };
    });
  
    return output;
  };
  


  const imageExtensionMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "image/webp": "webp"
  };
  
  type ConvertBase64ToFileOutputShape = {
    buffer: Buffer;
    fileName: string;
    contentType: string;
  };
  
  export const convertBase64ToImageFile = (base64: string) =>
    new Promise<ConvertBase64ToFileOutputShape>((resolve, reject) => {
      const [mimeType, byte] = base64.split(",");
  
      if (mimeType && byte) {
        if (btoa(atob(byte)) === byte) {
          const contentType:string|undefined = mimeType?.split(":")[1]?.split(";")[0];
          if (contentType) {
            const extension = imageExtensionMap[contentType];
            
            if (extension && contentType) {
                const fileName = `${Date.now().toString()}.${extension}`;
                const buffer = Buffer.from(byte, "base64");
                resolve({
                    buffer,
                    fileName,
                    contentType,
                });
            }else{
            reject("Conversion Error: Unsupported image type");
            }
          } else {
            reject("Conversion Error: Unsupported image type");
          }
        } else {
          reject("Conversion Error: File is not base64");
        }
      } else {
        reject("Conversion Error: Invalid input string");
      }
    });