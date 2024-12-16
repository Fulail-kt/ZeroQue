import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { 
  centerCrop, 
  makeAspectCrop, 
  Crop, 
  PixelCrop 
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '~/components/ui/button';
import { ZoomIn, ZoomOut, Upload } from 'lucide-react';

interface ImageCropperProps {
  onImageCropped: (croppedImageUrl: string) => void;
  aspectRatio?: number;
  minDimension?: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  onImageCropped, 
  aspectRatio = 1,  // Default to square crop
  minDimension = 150
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [zoom, setZoom] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      if (file) { 
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const result = reader.result as string;
          setImage(result);
          setZoom(1);
          setCrop(undefined);
        });
        
        reader.readAsDataURL(file);
      }
    }
  };
  const onImageLoaded = useCallback((img: HTMLImageElement) => {
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 80,
          height: 80
        },
        aspectRatio,
        img.width,
        img.height
      ),
      img.width,
      img.height
    );
    setCrop(crop);
  }, [aspectRatio]);

  const cropImage = async () => {
    if (!imageRef.current || !completedCrop) return;

    const image = imageRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );

    const croppedImageUrl = canvas.toDataURL('image/jpeg');
    onImageCropped(croppedImageUrl);
    
    // Reset state
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const zoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 3));
  };

  const zoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 1));
  };

  return (
    <div className="space-y-2">
      <input 
        type="file" 
        accept="image/*" 
        onChange={onSelectFile}
        ref={fileInputRef}
        className="hidden"
        id="image-upload"
      />
      
      {!image ? (
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" /> Upload Image
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              // Disable resizing by setting minWidth and minHeight to 100%
              minWidth={100}
              minHeight={100}
              // Disable handles for resizing
              ruleOfThirds={false}
              disabled={false}
            >
              <img
                ref={imageRef}
                alt="Crop preview"
                src={image}
                style={{ 
                  transform: `scale(${zoom})`, 
                  maxWidth: '100%', 
                  maxHeight: '400px',
                  objectFit: 'contain'
                }}
                onLoad={(e) => onImageLoaded(e.currentTarget)}
              />
            </ReactCrop>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={zoomOut}
                disabled={zoom <= 1}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm">{Math.round(zoom * 100)}%</span>
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={zoomIn}
                disabled={zoom >= 3}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              type="button" 
              onClick={cropImage}
              disabled={!completedCrop}
            >
              Crop & Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;