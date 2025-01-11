// 'use client'

// import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { cn } from "~/lib/utils";

// interface BannerCarouselProps {
//   banners: Array<{
//     url: string;
//     title: string;
//   }>;
//   autoPlayInterval?: number;
//   className?: string;
// }

// const BannerCarousel: React.FC<BannerCarouselProps> = ({ 
//   banners,
//   autoPlayInterval = 5000,
//   className
// }) => {
//   // Early return if no banners
//   if (!banners.length) return null;
  
//   // Memoize extended banners array to prevent recreation on every render
//   const extendedBanners = useMemo(() => [
//     ...banners,
//     ...banners,
//     ...banners,
//   ], [banners]);

//   const [state, setState] = useState({
//     currentIndex: banners.length,
//     isTransitioning: false
//   });
//   const [isHovered, setIsHovered] = useState(false);
//   const slideRef = useRef<HTMLDivElement>(null);
  
//   // Memoize handlers to prevent unnecessary recreations
//   const handleSlideChange = useCallback((direction: 'next' | 'prev') => {
//     if (!state.isTransitioning) {
//       setState(prev => ({
//         currentIndex: prev.currentIndex + (direction === 'next' ? 1 : -1),
//         isTransitioning: true
//       }));
//     }
//   }, [state.isTransitioning]);

//   const handleTransitionEnd = useCallback(() => {
//     setState(prev => {
//       let newIndex = prev.currentIndex;
      
//       if (newIndex >= banners.length * 2) {
//         newIndex -= banners.length;
//       } else if (newIndex <= banners.length - 1) {
//         newIndex += banners.length;
//       }
      
//       return {
//         currentIndex: newIndex,
//         isTransitioning: false
//       };
//     });
//   }, [banners.length]);

//   const handleDotClick = useCallback((index: number) => {
//     setState({
//       currentIndex: banners.length + index,
//       isTransitioning: true
//     });
//   }, [banners.length]);

//   // Autoplay effect
//   useEffect(() => {
//     if (!isHovered && banners.length > 1) {
//       const timer = setInterval(() => {
//         handleSlideChange('next');
//       }, autoPlayInterval);

//       return () => clearInterval(timer);
//     }
//   }, [isHovered, banners.length, autoPlayInterval, handleSlideChange]);

//   // Reset to middle group on mount
//   useEffect(() => {
//     setState(prev => ({ ...prev, currentIndex: banners.length }));
//   }, [banners.length]);

//   // Memoize active dot calculation
//   const activeDotIndex = state.currentIndex % banners.length;

//   const CarouselButton = useCallback(({ 
//     direction,
//     onClick
//   }: { 
//     direction: 'left' | 'right',
//     onClick: () => void 
//   }) => (
//     <button
//       onClick={onClick}
//       className={cn(
//         "absolute top-1/2 -translate-y-1/2 p-2 rounded-full",
//         "bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-colors",
//         direction === 'left' ? "left-4" : "right-4"
//       )}
//     >
//       {direction === 'left' ? 
//         <ChevronLeft className="w-6 h-6 text-white" /> : 
//         <ChevronRight className="w-6 h-6 text-white" />
//       }
//     </button>
//   ), []);

//   return (
//     <div 
//       className={cn(
//         "relative w-full overflow-hidden rounded-lg",
//         className
//       )}
//       style={{ aspectRatio: '3/1' }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div 
//         ref={slideRef}
//         className="flex w-full h-full"
//         style={{
//           transform: `translateX(-${state.currentIndex * 100}%)`,
//           transition: state.isTransitioning ? 'transform 500ms ease-out' : 'none'
//         }}
//         onTransitionEnd={handleTransitionEnd}
//       >
//         {extendedBanners.map((banner, index) => (
//           <div 
//             key={`${banner.url}-${index}`}
//             className="flex-shrink-0 w-full h-full"
//           >
//             <img
//               src={banner.url}
//               alt={banner.title}
//               className="w-full h-full object-cover"
//               loading={index < banners.length * 2 ? "eager" : "lazy"}
//             />
//           </div>
//         ))}
//       </div>

//       {banners.length > 1 && (
//         <>
//           <CarouselButton 
//             direction="left" 
//             onClick={() => handleSlideChange('prev')} 
//           />
//           <CarouselButton 
//             direction="right" 
//             onClick={() => handleSlideChange('next')} 
//           />

//           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
//             {banners.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleDotClick(index)}
//                 className={cn(
//                   "w-2 h-2 rounded-full transition-colors",
//                   index === activeDotIndex
//                     ? "bg-white" 
//                     : "bg-white/50 hover:bg-white/75"
//                 )}
//               />
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default React.memo(BannerCarousel);


'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from "~/lib/utils";

interface BannerCarouselProps {
  banners: Array<{
    url: string;
    title: string;
  }>;
  autoPlayInterval?: number;
  className?: string;
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ 
  banners,
  autoPlayInterval = 5000,
  className
}) => {
  // Move all hooks to the top level, before any conditional logic
  const extendedBanners = useMemo(() => [
    ...banners,
    ...banners,
    ...banners,
  ], [banners]);

  const [state, setState] = useState({
    currentIndex: banners.length,
    isTransitioning: false
  });
  
  const [isHovered, setIsHovered] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  
  const handleSlideChange = useCallback((direction: 'next' | 'prev') => {
    if (!state.isTransitioning) {
      setState(prev => ({
        currentIndex: prev.currentIndex + (direction === 'next' ? 1 : -1),
        isTransitioning: true
      }));
    }
  }, [state.isTransitioning]);

  const handleTransitionEnd = useCallback(() => {
    setState(prev => {
      let newIndex = prev.currentIndex;
      
      if (newIndex >= banners.length * 2) {
        newIndex -= banners.length;
      } else if (newIndex <= banners.length - 1) {
        newIndex += banners.length;
      }
      
      return {
        currentIndex: newIndex,
        isTransitioning: false
      };
    });
  }, [banners.length]);

  const handleDotClick = useCallback((index: number) => {
    setState({
      currentIndex: banners.length + index,
      isTransitioning: true
    });
  }, [banners.length]);

  useEffect(() => {
    if (!isHovered && banners.length > 1) {
      const timer = setInterval(() => {
        handleSlideChange('next');
      }, autoPlayInterval);

      return () => clearInterval(timer);
    }
  }, [isHovered, banners.length, autoPlayInterval, handleSlideChange]);

  useEffect(() => {
    setState(prev => ({ ...prev, currentIndex: banners.length }));
  }, [banners.length]);

  const activeDotIndex = state.currentIndex % banners.length;

  const CarouselButton = useCallback(({ 
    direction,
    onClick
  }: { 
    direction: 'left' | 'right',
    onClick: () => void 
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 p-2 rounded-full",
        "bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-colors",
        direction === 'left' ? "left-4" : "right-4"
      )}
    >
      {direction === 'left' ? 
        <ChevronLeft className="w-6 h-6 text-white" /> : 
        <ChevronRight className="w-6 h-6 text-white" />
      }
    </button>
  ), []);

  // Early return after all hooks are declared
  if (!banners.length) return null;

  return (
    <div 
      className={cn(
        "relative w-full overflow-hidden rounded-lg",
        className
      )}
      style={{ aspectRatio: '3/1' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        ref={slideRef}
        className="flex w-full h-full"
        style={{
          transform: `translateX(-${state.currentIndex * 100}%)`,
          transition: state.isTransitioning ? 'transform 500ms ease-out' : 'none'
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedBanners.map((banner, index) => (
          <div 
            key={`${banner.url}-${index}`}
            className="flex-shrink-0 w-full h-full"
          >
            <img
              src={banner.url}
              alt={banner.title}
              className="w-full h-full object-cover"
              loading={index < banners.length * 2 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <CarouselButton 
            direction="left" 
            onClick={() => handleSlideChange('prev')} 
          />
          <CarouselButton 
            direction="right" 
            onClick={() => handleSlideChange('next')} 
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === activeDotIndex
                    ? "bg-white" 
                    : "bg-white/50 hover:bg-white/75"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(BannerCarousel);