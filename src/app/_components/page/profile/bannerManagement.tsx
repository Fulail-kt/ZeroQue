'use client'
export interface Banner {
    _id?: string;
    title: string;
    url: string;
    isActive: boolean;
  }
  
  export interface CompanyData {
    // ... existing types
    banners: Banner[];
  }
  import { MoreVertical, Trash2, X } from 'lucide-react';
  import Image from 'next/image';
    // components/BannerUploader.tsx
    import React, { useState } from 'react';
    import { Button } from '~/components/ui/button';
    import { Input } from '~/components/ui/input';
    import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import ImageCropper from '../../global/imageCropper';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
  
  interface BannerCardProps {
    banner: Banner;
    onToggleActive: (bannerId: string) => void;
    onDelete: (bannerId: string) => void;
  }
  
  export const BannerCard: React.FC<BannerCardProps> = ({
    banner,
    onToggleActive,
    onDelete,
  }) => {
    return (
      <div className="rounded-lg grid grid-cols-3 justify-items-end p-1 items-center border bg-card text-card-foreground shadow-sm">
        <div className="relative w-full">
          <img
            src={banner.url}
            alt={banner.title}
            className="rounded w-32"
          />
        </div>
        <div>
          <h3 className="font-semibold">{banner.title}</h3>
        </div>
        <div className="flex">
          <div className="flex items-center justify-between space-x-3">
           
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onToggleActive(banner._id!)}
                  className="cursor-pointer"
                >
                  {banner.isActive ? 'Deactivate' : 'Activate'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(banner._id!)}
                  className="cursor-pointer text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    );
  };

  
  interface BannerUploaderProps {
    onBannerAdd: (banner: { title: string; url: string }) => void;
  }
  
  export const BannerUploader: React.FC<BannerUploaderProps> = ({ onBannerAdd }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);
  
    const handleSubmit = () => {
      if (title && croppedImage) {
        onBannerAdd({ title, url: croppedImage });
        handleClose();
      }
    };
  
    const handleClose = () => {
      setIsOpen(false);
      setTitle('');
      setCroppedImage(null);
      setShowCropper(false);
    };
  
    const handleClearImage = () => {
      setCroppedImage(null);
      setShowCropper(false);
    };
  
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Add New Banner</Button>
  
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Banner</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Banner Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              
              {croppedImage ? (
                <div className="relative">
                  <div className="relative  w-full rounded-lg overflow-hidden border">
                    <img
                      src={croppedImage}
                      alt="Preview"
                      className="size-[50%]"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full"
                    onClick={handleClearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                    <ImageCropper
                      onImageCropped={(url) => {
                        setCroppedImage(url);
                        setShowCropper(false);
                      }}
                      aspectRatio={3/1}
                      minDimension={300}
                    /> </div>
              )}
  
              <Button
                onClick={handleSubmit}
                disabled={!title || !croppedImage}
                className="w-full"
              >
                Save Banner
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
  )}  