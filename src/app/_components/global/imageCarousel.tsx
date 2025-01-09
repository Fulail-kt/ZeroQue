import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "~/components/ui/carousel";

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  // If no images, return null or a placeholder
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Carousel 
      className="w-full "
      opts={{
        align: "start",
        loop: images.length > 1,
      }}
    >
      <CarouselContent className=''>
        {images.map((image, index) => (
          <CarouselItem key={index} className="basis-full w-full">
            <div className="p-1">
              <img 
                src={image} 
                width={150}
                height={150}
                alt={`Product image ${index + 1}`} 
                className="w-full h-60 lg:h-full lg:max-h-max object-fil rounded-lg" 
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious className="left-2 bg-transparent border-none h-full hover:bg-transparent focus:bg-transparent" />
          <CarouselNext className="right-2  bg-transparent border-none h-full hover:bg-transparent focus:bg-transparent" />
        </>
      )}
    </Carousel>
  );
};

export default ImageCarousel;